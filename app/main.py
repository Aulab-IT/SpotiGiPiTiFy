from fastapi import FastAPI
from app.routes import chat_router
from fastapi.middleware.cors import CORSMiddleware
from app.services.spotify_service import Spotify

app = FastAPI()

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:8080",
    "http://localhost:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    chat_router.router,
    tags=["Chat"],
    prefix="/chat"
)


# Metodi HTTP
# GET -> recupera una risorsa
# POST -> crea una risorsa 
# PUT -> modifica una risorsa
# PATCH -> modifica un campo di una risorsa
# DELETE -> cancella una risorsa


# Path Parameters -> parametri passati nel path di una risorsa (ROTTE PARAMETRICHE)
# Query Parameters -> parametri passati nel query string di una risorsa
# Request Body -> parametri passati nel body di una risorsa