from fastapi import APIRouter
from pydantic import BaseModel
from app.services.openai_service import OpenAIService
router = APIRouter()


class ChatComplentionRequest(BaseModel):
    model : str
    message : str
    temperature: float = 1.0  # Valore tra 0 e 2. Più alto è, più creative sono le risposte.
    top_p: float =1.0  # Alternativa alla temperatura. Definisce la probabilità cumulativa per il campionamento.
    n : int =1  # Numero di risposte da generare per ogni messaggio.
    stop : list = []  # Fino a 4 sequenze dove l'API smetterà di generare ulteriori token.




@router.post("/completion")
def chat_completion(request : ChatComplentionRequest):
    openai = OpenAIService()

    response = openai.get_completion(
        model= request.model,
        message = request.message
    )

    return response

@router.post("/embedding")
def generate_embedding(text):
    openai = OpenAIService()

    response = openai.get_embedding(
        text = text
    )

    return response