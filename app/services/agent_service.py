import os , json , openai
from dotenv import load_dotenv
from openai import OpenAI
from app.services.spotify_service import Spotify
from app.models.spotify_models import Playlist , SpotifyTrack
load_dotenv()



TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "speak_to_user",
            "description": "Use this to speak to the user to give them information and to ask for anything required for their case.",
            "parameters": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "Text of message to send to user. Can cover multiple topics."
                    }
                },
                "required": [
                    "message"
                ]
            }
        }
    },
    {
        "type": "function",
        "function":  {
            "name": "get_user_playlists",
            "description": "Use this to get the user playlists",
        }
    },
    {
        "type": "function",
        "function":  {
            "name": "search_track_by_name_with_spotify_api",
            "description": "Search for a track by name and artist in spotify. You can use this function to search a track before adding it to the playlist.",
            "parameters": {
                "type": "object",
                "properties": {
                    "artist": {
                        "type": "string",
                        "description": "Name of the artist"
                    },
                    "track_name": {
                        "type": "string",
                        "description": "Name of the track"
                    }
                },
                "required": [
                    "artist",
                    "track_name"
                ]
            }
        }  
    },
    openai.pydantic_function_tool(Playlist, name="create_or_update_playlist" , description="Use this function to create a playlist. Before using this function, use search_track_by_name_with_spotify_api to search a track to get track uri."),
    # openai.pydantic_function_tool(Playlist, name="add_playlist_to_spotify" , description="Use this to add the playlist to spotify"),
]

GPT_MODEL = "gpt-4o"

ASSISTANT_SYSTEM_PROMPT = """
    Sei un assistente virtuale che cerca canzoni per l'utente su spotify.
    Non usare il markdown per le risposte.
    Segui il seguente flusso per raccogliere le informazioni dell'utente:

    1. Scopo della playlist
        Per quale occasione o attività? (Relax, studio, allenamento, festa, viaggio, ecc.)
        Deve seguire un tema specifico? (Es. "anni '80", "colonne sonore", "serata romantica")
    2. Mood o atmosfera
        Che tipo di emozioni deve evocare? (Energica, rilassante, malinconica, gioiosa, ecc.)
        Preferenze di ritmo: veloce, medio, lento.
    3. Generi musicali
        Generi preferiti (pop, rock, jazz, elettronica, ecc.)
    4. Artisti o brani specifici
        Quali artisti o canzoni devono essere inclusi o evitati?
        Preferenze per musica famosa vs pezzi meno conosciuti.
    5. Lingua o provenienza
        Brani in una lingua specifica (italiano, inglese, mix, ecc.)
        Interesse per musica di una certa area geografica (es. musica latina, europea, africana).
    6. Durata della playlist
        Tempo totale desiderato (es. 30 minuti, 1 ora, 2 ore).
        Numero di brani (se preferito).

    Dopo che hai raccolto tutti le preferenze dell'utente, usa la funzione "search_track_by_name_with_spotify_api" per cercare i brani e la funzione "create_or_update_playlist" per generare la playlist. 

    Puoi utilizzare la funzione create_or_update_playlist per generare la playlist o per modificare una esistente.

    Se l'utente ti chiede di modificare / aggiungere brani alla playlist usa la funzione "create_or_update_playlist" prima di usare la funzione "speak_to_user"

    La playlist attuale e' {playlist}

    E mostra la playlist all'utente con il tool "show_playlist_to_user"

"""


class AgentService():
    client = None

    def __init__(self , conversation_messages , playlist):
        self.client = OpenAI(
            api_key = os.getenv("OPENAI_API_KEY")
        )

        self.playlist = playlist
        self.conversation_messages = conversation_messages

    
    def spotify_assistant(self):
        resolved = False

        while resolved is False:
            messages = [
                {
                    'role' : 'system',
                    "content" : ASSISTANT_SYSTEM_PROMPT.format(playlist = self.playlist)
                }
            ]

            [messages.append(message) for message in self.conversation_messages]

            response = self.client.chat.completions.create(
                model = GPT_MODEL,
                messages = messages,
                temperature = 0.5,
                tools = TOOLS,
                tool_choice="required"
            )

            self.conversation_messages.append(response.choices[0].message)

            resolved = self.execute_function(
                function_calls = response.choices[0].message.tool_calls,
            )


        return {"messages" : self.conversation_messages , "playlist" : self.playlist}

    def execute_function(self, function_calls):
        for function_call in function_calls:
            function_id = function_call.id
            function_name = function_call.function.name
            arguments = json.loads(function_call.function.arguments)

            print(f"Processing function call: {function_name} with ID: {function_id}")

            match function_name:
                case "speak_to_user":
                    resolved = True
                    print(f"Executing 'speak_to_user'")
                    content = arguments["message"]

                case "get_user_playlists":
                    resolved = False
                    print("Executing 'get_user_playlists'")

                    playlists = Spotify().get_user_playlists()

                    content = json.dumps(playlists)

                case "add_playlist_to_spotify":
                    resolved = False

                    result = Spotify().save_playlist(
                        name = arguments['name'],
                        playlist = arguments['tracks']   
                    )

                    content = json.dumps(result)

                case "create_or_update_playlist":
                    resolved = False

                    self.playlist = arguments

                    content = json.dumps({"success": True})


                case "search_track_by_name_with_spotify_api":
                    resolved = False

                    artist = arguments["artist"]
                    track_name = arguments["track_name"]

                    search_q = f"remaster%2520track%3A{track_name}%2520artist:{artist}"
                        # remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis
                    r = Spotify().sp.search(
                        q = search_q,
                        type = "track",
                        limit = 5
                    )

                    completion = self.client.beta.chat.completions.parse(
                        model="gpt-4o-2024-08-06",
                        messages=[
                            {"role": "system", "content": "Data la seguente risposta da un'api di spotify seleziona la traccia corretta. Spotify API Response : \n" + json.dumps(r)}
                        ],
                        response_format=SpotifyTrack,
                    )

                    print("###########################")
                    print(completion)   
                    print("###########################")


                    content = json.dumps(completion.choices[0].message.content)


            self.conversation_messages.append(
                {
                    "tool_call_id": function_id,
                    "role": "tool",
                    "name": function_name,
                    "content": content
                }
            )

        return resolved




