from fastapi import APIRouter
from pydantic import BaseModel
from app.services.openai_service import OpenAIService
from app.services.spotify_service import Spotify
router = APIRouter()


class ChatComplentionRequest(BaseModel):
    messages : list




@router.post("/test")
def test():
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

@router.post("/completion")
def chat_completion(request : ChatComplentionRequest):
    openai = OpenAIService()

    response = openai.spotify_assistant(
        conversation_messages = request.messages
    )

    return response
