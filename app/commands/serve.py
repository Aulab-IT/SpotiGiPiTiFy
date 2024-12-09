import os

def main():
    os.system("poetry run uvicorn app.main:app --reload --port 8080")
    # exec("poetry run uvicorn app.main:app --reload --port 8080")

