
![Lele Voice](chatterbox-ui/src/assets/leleVoice.png)


🚀 Lele Voice - Guida di Avvio Locale
Interfaccia web locale per il modello Chatterbox Multilingual TTS. Questo progetto è diviso in due server che devono essere eseguiti contemporaneamente.

🔗 Architettura Client-Server
🐍 Backend (API Server):

File: ap_server.py

Tecnologia: Python, FastAPI, Uvicorn

Scopo: Carica il modello TTS e gestisce le richieste di generazione audio.

Porta: http://127.0.0.1:8000

⚛️ Frontend (UI Server):

Cartella: chatterbox-ui/

Tecnologia: React, Vite

Scopo: Fornisce l'interfaccia utente nel browser e invia le richieste al backend.

Porta: http://localhost:5173 (di solito)

📦 Installazione (Solo la prima volta)
Assicurati di avere Anaconda e Node.js installati.

1. Backend (Python)
Assicurati che il tuo ambiente Conda chatterbox sia stato creato e che tutte le dipendenze Python (come fastapi, uvicorn, torch, chatterbox-tts) siano installate al suo interno.

2. Frontend (Node)
Installa i pacchetti Node.js:

Bash

cd chatterbox-ui
npm install
⚡ Avvio Applicazione
Per avviare l'app, devi eseguire due terminali separati.

🖥️ Terminale 1: Server Back-end (FastAPI)
Apri Anaconda Prompt.

Spostati nella cartella chatterbox del progetto:

Bash
cd percorso/del/progetto/chatterbox
Attiva l'ambiente corretto:

Bash
conda activate chatterbox
Torna alla cartella radice (dove si trova ap_server.py):

Bash
cd ..

Avvia il server FastAPI:

Bash
uvicorn ap_server:app --reload
Nota: Lascia questo terminale aperto. Dovresti vedere un output che conferma che il server è in esecuzione su http://127.0.0.1:8000.

🖥️ Terminale 2: Server Front-end (Vite)
Apri un secondo terminale (puoi usare un altro Anaconda Prompt o un terminale standard).

Spostati nella cartella chatterbox-ui:

Bash

cd percorso/del/progetto/chatterbox-ui
Avvia il server di sviluppo React:

Bash
npm run dev

Fatto! Vite aprirà automaticamente il tuo browser all'indirizzo http://localhost:5173 (o un'altra porta se la 5173 è occupata).
L'interfaccia React è configurata (tramite vite.config.js) per inviare le richieste /api al tuo backend Python.
