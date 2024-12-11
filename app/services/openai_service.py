import os , json , openai
from dotenv import load_dotenv
from openai import OpenAI
from app.services.spotify_service import Spotify
from pydantic import BaseModel

load_dotenv()


class SpotifyTrackPydantic(BaseModel):
    uri : str
    name : str
    artist : str
    album : str
    spotify_external_url : str

class SpotifyTrack():
    def __init__(self, uri, name, artist, album):
        self.uri = uri
        self.name = name
        self.artist = artist
        self.album = album

class Track(BaseModel):
    name: str
    artist: str
class Playlist(BaseModel):
    name: str
    tracks: list[Track]

tools = [
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
            "description": "Get the playlists of the user"
        }
    },
    {
        "type": "function",
        "function":  {
            "name": "search_track_by_name",
            "description": "Search for a track by name and artist in spotify",
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
    openai.pydantic_function_tool(Playlist, name="show_playlist_to_user" , description="Use this to show the playlist to the user"),
    # openai.pydantic_function_tool(Playlist, name="add_playlist_to_spotify" , description="Use this to add the playlist to spotify"),



]

GPT_MODEL = "gpt-4o"

# ASSISTANT_SYSTEM_PROMPT = """
#     Sei un assistente che aiuta a creare playlist su spotify. Il tuo compito è capire l'umore dell'utente e in base a quello generare una playlist corrispettiva dell'umore dell'utente. Per capire l'umore dell'utente inizia facendo 5 domande in una conversazione naturale.

#     Crea una playlist con almeno 3 differenti artisti.
#     La playlist deve essere di almeno 10 canzoni.

#     Devi seguire queste istruzioni per creare una playlist dell'utente:
#         - Capire l'umore dell'utente.
#         - Generare una playlist corrispettiva dell'umore dell'utente.
#         - Mostrare all'utente la lista delle canzoni della playlist creata.
#         - Chiedere all'utente se vuole aggiungere delle canzoni alla playlist.
#         - Chiedere all'utente se vuole aggiungere un nome alla playlist.
#         - Chiedere conferma all'utente di aggiungere la playlist su spotify.
#         - Aggiungere la playlist su spotify.
# """
ASSISTANT_SYSTEM_PROMPT = """
    Sei un assistente virtuale che cerca canzoni per l'utente su spotify.
"""

class OpenAIService():
    client = None

    def __init__(self):
        self.client = OpenAI(
            api_key = os.getenv("OPENAI_API_KEY")
        )

    
    def spotify_assistant(self , conversation_messages):
        resolved = False

        while resolved is False:
            messages = [
                {
                    'role' : 'system',
                    "content" : ASSISTANT_SYSTEM_PROMPT
                }
            ]

            [messages.append(message) for message in conversation_messages]

            response = self.client.chat.completions.create(
                model = GPT_MODEL,
                messages = messages,
                temperature = 0.5,
                tools = tools,
                tool_choice="required"
            )

            conversation_messages.append(response.choices[0].message)

            resolved, conversation_messages = self.execute_function(
                function_calls = response.choices[0].message.tool_calls,
                messages = conversation_messages
            )


        return conversation_messages


    def execute_function(self, function_calls, messages):
        for function_call in function_calls:
            function_id = function_call.id
            function_name = function_call.function.name
            arguments = json.loads(function_call.function.arguments)

            
            print(f"Processing function call: {function_name} with ID: {function_id}")


            if function_name == "speak_to_user":
                resolved = True
                print(f"Executing 'speak_to_user'")
                
                messages.append(
                    {
                        "tool_call_id": function_id,
                        "role": "tool",
                        "name": function_name,
                        "content": arguments["message"]
                    }
                )

            elif function_name == "get_user_playlists":
                resolved = False
                print("Executing 'get_user_playlists'")

                playlists = Spotify().get_user_playlists()

                messages.append(
                    {
                        "tool_call_id": function_id,
                        "role": "tool",
                        "name": function_name,
                        "content": json.dumps(playlists)
                    }
                )

            elif function_name == "add_playlist_to_spotify":
                resolved = False
                print("Executing 'add_playlist_to_spotify'")

                print("##########")
                print("Argument:" , arguments)
                print("##########")
                SpotifyPlaylist = []

                for t in arguments["tracks"]:
                    # try:
                
                    search_q = f"remaster%2520track%3A{t['name']}%2520artist:{t['artist']}"
                    # remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis
                    r = Spotify().sp.search(
                        q = search_q,
                        type = "track",
                        limit = 10
                    )

                    print("###########################")
                    print(r)
                    print("###########################")
                    
                    item = r['tracks']['items'][0]  # Select the first track
                    track = SpotifyTrack(
                        uri=item['uri'], 
                        name=item['name'],                 
                        artist=item['artists'], 
                        album=item['album']
                    )
                    SpotifyPlaylist.append(track)
                    # except:
                    #     print("Track not found: {}".format(t))



                result = Spotify().save_playlist(
                    name = arguments['name'],
                    playlist = SpotifyPlaylist   
                )

                messages.append(
                    {
                        "tool_call_id": function_id,
                        "role": "tool",
                        "name": function_name,
                        "content": json.dumps(result)
                    }
                )

            elif function_name == "show_playlist_to_user":
                resolved = True

                messages.append(
                    {
                        "tool_call_id": function_id,
                        "role": "tool",
                        "name": function_name,
                        "content": json.dumps(arguments)
                    }
                )

            elif function_name == "search_track_by_name":
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
                    response_format=SpotifyTrackPydantic,
                )

                print("###########################")
                print(completion)   
                print("###########################")

                messages.append(
                    {
                        "tool_call_id": function_id,
                        "role": "tool",
                        "name": function_name,
                        "content": json.dumps(completion.choices[0].message.content)
                    }
                )



        # print(f"Resolved: {resolved}, Messages: {messages}")
        return (resolved, messages)




