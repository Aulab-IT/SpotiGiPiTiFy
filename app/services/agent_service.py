import os , json , openai
from dotenv import load_dotenv
from openai import OpenAI
from app.services.spotify_service import Spotify
from app.models.spotify_models import Playlist , SpotifyTrack
load_dotenv()


API_KEY = "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"

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
    # TODO: Function Tool Get User Playlists
    {
       "type": "function",
        "function":  {
            "name": "get_user_playlists",
            "description": "Use this to get the user playlists",
        }
    },
    # TODO: Function Tool Search Track By Name With Spotify Api per cercare la Traccia su spotify
    {
        "type": "function",
        "function": {
            "name" : "search_track_by_name_with_spotify_api",
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
    # TODO: Function Tool Create Or Update Playlist Funzione per creare o aggiornare la playlist questa funzione prendera' come formato di dati in input un oggetto di tipo playlist 
    openai.pydantic_function_tool(Playlist, name="create_or_update_playlist" , description="Use this function to create a playlist. Before using this function, use search_track_by_name_with_spotify_api to search a track to get track uri.")

]

GPT_MODEL = "gpt-4o"

AGENT_SYSTEM_PROMPT = """
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
"""


class AgentService():
    client = None

    def __init__(self , conversation_messages , playlist):
        self.client = OpenAI(
            api_key = API_KEY
        )

        self.playlist = playlist
        self.conversation_messages = conversation_messages

    
    def spotify_assistant(self):
        resolved = False

        while resolved is False:
            messages = [
                {
                    'role' : 'system',
                    "content" : AGENT_SYSTEM_PROMPT.format(playlist = self.playlist)
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
        """
        execute_function esegue una funzione passata come argomento e restituisce il contenuto della risposta
        come stringa JSON.
        
        La funzione prende come argomento un elenco di funzioni da eseguire, ogni funzione 
        e' identificata da un id e da un nome che rappresenta la funzione da chiamare, 
        inoltre contiene un elenco di argomenti che devono essere passati alla funzione.
        
        La funzione restituisce True se la funzione e' stata eseguita correttamente, False altrimenti.
        
        Ad esempio se viene passata la funzione "speak_to_user" con argomento "Ciao come stai?"
        la funzione esegue la chiamata alla funzione "speak_to_user" con argomento "Ciao come stai?" e
        restituisce la risposta come stringa JSON.
        """
        
        for function_call in function_calls:
            print(f"execute_function: {function_call}")
            function_id = function_call.id
            function_name = function_call.function.name
            arguments = json.loads(function_call.function.arguments)

            match function_name:
                case "speak_to_user":
                    resolved = True
                    content = arguments["message"]

                case "get_user_playlists":
                    resolved = False
                    # TODO: prendere le playlist dell'utente tramite la funzione get_user_playlists
                    playlists = Spotify().get_user_playlists()
                    print(f"execute_function: playlists = {playlists}")
                    # TODO: la risposta sara' le playlist dell'utente
                    content = json.dumps(playlists)
                case "create_or_update_playlist":
                    print(f"execute_function: create_or_update_playlist")
                    resolved = False
                    # TODO : impostiamo self.playlist con il contenuto di arguments che sara' la playlist con i brani 
                    self.playlist = arguments
                    # TODO: impostiamo come content un semplice messaggio di risposta.
                    content = "Playlist aggiornata correttamente"
                case "search_track_by_name_with_spotify_api":
                    resolved = False
                    # TODO: prendiamo l'artista e il nome della traccia passati come argomenti
                    artist = arguments["artist"]
                    track_name = arguments["track_name"]
                    print(f"execute_function: artist = {artist}, track_name = {track_name}")
                    # TODO: creiamo la query per la ricerca su spotify
                    # remaster%2520track%3A{Doxy}%2520artist%3A{Miles Davis}
                    query = f"remaster%2520track%3A{track_name}%2520artist%3A{artist}"

                    # TODO: eseguiamo la ricerca su spotify mandando i seguenti argomenti 
                    # q = query
                    # type = track
                    # limit = 5
                    response = Spotify().sp.search(
                        q = query,
                        type = "track",
                        limit = 5
                    )

                    print(f"execute_function: search response = {response}")

                    # TODO: chiediamo a GPT di selezionare la traccia corretta e impostiamo il modello della risposta come oggetto SpotifyTrack
                    gptResponse = self.client.beta.chat.completions.parse(
                                    model = GPT_MODEL,
                                    messages = [
                                        {"role" : "system" , "content" : "Sei un assistente che deve inidividuare la traccia corretta da un elenco di brani. L'elenco di brani e' una chiamata alle api di Spotify. "},
                                        {"role" : "user" , "content" : f"Quale traccia devi scegliere tra {json.dumps(response)}?"}
                                    ],
                                    temperature = 0.2,
                                    response_format=SpotifyTrack
                                )
                    
                    print(f"execute_function: gptResponse = {gptResponse.choices[0].message.content}")
                    
                    # TODO: Prendiamo il contenuto della risposta e lo inseriamo nel contenuto della risposta
                    content = json.dumps(gptResponse.choices[0].message.content)


            self.conversation_messages.append(
                {
                    "tool_call_id": function_id,
                    "role": "tool",
                    "name": function_name,
                    "content": content
                }
            )

        return resolved




