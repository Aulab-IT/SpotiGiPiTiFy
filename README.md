## Inizializzazione del progetto

Dopo aver clonato il progetto, è necessario installare le dipendenze con il comando:

```bash
poetry install
```

Copiamo il file `.env.example` e rinominiamo il file `.env`:

```bash
cp .env.example .env
```

Aggiungiamo la chiave API di OpenAI al file `.env`:

```bash
OPENAI_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Avvio del progetto

Avviamo a questo punto il server con il comando:

```bash
poetry run uvicorn app.main:app --reload
```
```bash
poetry run uvicorn app.main:app --reload --port 8080
```