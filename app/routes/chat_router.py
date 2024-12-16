from fastapi import APIRouter
from pydantic import BaseModel
from app.services.agent_service import AgentService
from app.services.spotify_service import Spotify
router = APIRouter()

class SpotifyAssistantRequest(BaseModel):
    messages : list
    playlist : dict


@router.post("/spotify-assistant")
def spotify_assistant(request : SpotifyAssistantRequest):
    agent = AgentService(
        conversation_messages = request.messages,
        playlist = request.playlist
    )


    response = agent.spotify_assistant()

    return response

@router.post("/test/search")
def search():
    search_q = "{} artist {}".format('Enter Sandman', "Metallica")
    r = Spotify().sp.search(
        q = search_q,
        type = "track",
        limit = 1
    )

    print("###########################")
    print(r)
    print("###########################")

    return r

@router.post("/test/user_tracks")
def test():
    r = Spotify().get_current_user_saved_tracks()

    return r