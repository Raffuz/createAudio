import io
import os
import tempfile
import torch
from typing import Optional 
from fastapi import FastAPI, UploadFile, Form, HTTPException, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
import torchaudio as ta

# --- PATCH CRITICA DI PYTORCH ---
# Necessaria per mappare i pesi salvati su CUDA sulla CPU, risolvendo:
# "RuntimeError: Attempting to deserialize object on a CUDA device but torch.cuda.is_available() is False."
try:
    if not torch.cuda.is_available():
        # Salviamo la funzione originale torch.load
        torch_load_original = torch.load
        
        # Definiamo la patch per forzare map_location='cpu'
        def patched_torch_load(*args, **kwargs):
            if 'map_location' not in kwargs:
                kwargs['map_location'] = torch.device('cpu') 
            return torch_load_original(*args, **kwargs)

        # Applichiamo la patch
        torch.load = patched_torch_load
        print("💡 Patch PyTorch applicata con successo per il caricamento su CPU.")
except Exception as e:
    # Gestione di fallback se la patch fallisce (molto improbabile)
    print(f"❌ Errore durante l'applicazione della patch PyTorch: {e}")

# --- CONFIGURAZIONE E CARICAMENTO MODELLO ---
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🚀 Inizializzazione FastAPI su device: {DEVICE}")

# Carica il modello all'avvio: operazione a latenza elevata.
try:
    MODEL = ChatterboxMultilingualTTS.from_pretrained(device=DEVICE)
    # Riporta la funzione torch.load al suo stato originale dopo il caricamento
    if 'patched_torch_load' in locals():
        torch.load = torch_load_original
        
    print(f"✅ Modello Chatterbox caricato con successo.")
except Exception as e:
    print(f"❌ Errore critico nel caricamento del modello: {e}")
    MODEL = None

# --- APPLICAZIONE FASTAPI ---
app = FastAPI(title="Chatterbox TTS API")

# ABILITA CORS: necessario per la comunicazione con il front-end Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # ADATTARE: Sostituisci con l'URL del tuo front-end in produzione.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "running", "model_loaded": MODEL is not None, "device": DEVICE}

@app.post("/generate-tts")
async def generate_tts(
    text_input: str = Form(...),
    language_id: str = Form(...),
    exaggeration_input: float = Form(0.5),
    cfgw_input: float = Form(0.5),
    temperature_input: float = Form(0.8),
    seed_num_input: int = Form(0),
    # Dichiarazione robusta del campo file opzionale
    audio_prompt_path_input: Optional[UploadFile] = File(None), 
):
    if MODEL is None:
        raise HTTPException(status_code=503, detail="TTS Model not initialized. Check server logs.")

    # 1. Validazione e Conversione Parametri
    try:
        exaggeration = float(exaggeration_input)
        cfg_weight = float(cfgw_input)
        temperature = float(temperature_input)
        seed_num = int(seed_num_input)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Form parameter validation failed: {e}")

    # 2. Gestione File Temporaneo per Clonazione Vocale
    temp_prompt_path = None
    final_audio_prompt_path = None
    
    # Controlla se l'oggetto UploadFile è presente e ha un nome file
    if audio_prompt_path_input is not None and audio_prompt_path_input.filename:
        try:
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                content = await audio_prompt_path_input.read()
                
                if not content or len(content) < 100: 
                    raise ValueError("File audio reference is empty or too small.")
                    
                tmp.write(content)
                temp_prompt_path = tmp.name
                final_audio_prompt_path = temp_prompt_path
            
        except Exception as e:
            if temp_prompt_path and os.path.exists(temp_prompt_path):
                os.remove(temp_prompt_path)
            raise HTTPException(status_code=400, detail=f"Failed to process uploaded audio: {e}")

    # 3. Logica di Generazione e Gestione Errori Interni
    print(f"Generating: {text_input[:30]}... Lang: {language_id}")
    try:
        # Imposta il seed prima della generazione
        if seed_num != 0:
            torch.manual_seed(seed_num)
            if DEVICE == "cuda":
                torch.cuda.manual_seed_all(seed_num)
        
        # Chiama il metodo di generazione
        wav = MODEL.generate(
            text=text_input,
            language_id=language_id,
            audio_prompt_path=final_audio_prompt_path, 
            exaggeration=exaggeration,
            cfg_weight=cfg_weight,
            temperature=temperature,
        )
        
        # 4. Preparazione della Risposta e Streaming
        buffer = io.BytesIO()
        ta.save(buffer, wav.cpu(), MODEL.sr, format="wav") 
        buffer.seek(0)

        return StreamingResponse(
            buffer,
            media_type="audio/wav",
            headers={"Content-Disposition": "attachment; filename=tts_output.wav"}
        )

    except Exception as e:
        print(f"🚨 Errore fatale durante la generazione TTS: {e}")
        # Restituisce il codice 500 con un messaggio dettagliato
        raise HTTPException(status_code=500, detail=f"Internal TTS generation failed. Error: {str(e)}")

    finally:
        # 5. Pulizia Risorse
        if temp_prompt_path and os.path.exists(temp_prompt_path):
            os.remove(temp_prompt_path)