import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

class OpenAIService():
    client = None

    def __init__(self):
        self.client = OpenAI(
            api_key = os.getenv("OPENAI_API_KEY")
        )


    def get_completion(self , model , message):
        response = self.client.chat.completions.create(
            model = model,
            messages = [
                {"role" : "system" , "content" : "L'output deve essere in formato HTML"},   
                {"role" : "user" , "content" : message}
            ]
        )

        return response
    
    def get_embedding(self , text):
        response = self.client.embeddings.create(
            input = text,
            model = "text-embedding-3-small"
        )

        return response.data[0].embedding


