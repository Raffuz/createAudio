import React, { useState } from "react";
import TtsControlPanel from "./TtsControlPanel";
import AudioOutput from "./AudioOutput";
import Navbar from "./Navbar"; // 👈 IMPORT NAVBAR

/**
 * Componente radice dell'applicazione.
 * Gestisce lo stato globale della generazione (loading, output audio, errori)
 * e incapsula la logica di comunicazione con l'API back-end (FastAPI).
 */
function App() {
  const [loading, setLoading] = useState(false);
  const [outputAudio, setOutputAudio] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState("tts", "output"); // 👈 STATO PAGINA PER LA NAVBAR

  /**
   * Esegue la richiesta POST all'endpoint API, inviando i dati come multipart/form-data.
   * @param {object} params - Oggetto contenente tutti i parametri del form.
   */
  const handleGenerate = async (params) => {
    // Inizializzazione dello stato di attesa
    setLoading(true);
    setOutputAudio(null);
    setError(null);

    // 1. Serializzazione dei dati nel formato FormData
    const formData = new FormData();
    formData.append("text_input", params.text);
    formData.append("language_id", params.language_id);

    // I nomi dei campi sono stati verificati per corrispondere ai parametri di FastAPI (Form(...))
    if (params.audio_prompt_file) {
      // Invia il file binario, essenziale per la logica di voice cloning.
      formData.append("audio_prompt_path_input", params.audio_prompt_file);
    }
    formData.append("exaggeration_input", params.exaggeration.toString());
    formData.append("cfgw_input", params.cfg_weight.toString());
    formData.append("temperature_input", params.temperature.toString());
    formData.append("seed_num_input", params.seed.toString());

    try {
      // 2. Esecuzione della Chiamata Fetch API
      // L'URL "/api/generate-tts" viene reindirizzato dal proxy di Vite a http://127.0.0.1:8000
      const response = await fetch("/api/generate-tts", {
        method: "POST",
        body: formData, // Il browser imposta automaticamente l'header multipart/form-data
      });

      if (!response.ok) {
        // Gestione degli errori HTTP con estrazione del messaggio di dettaglio
        const errorText = await response.text();
        throw new Error(`Errore HTTP ${response.status}: ${errorText}`);
      }

      // 3. Elaborazione della Risposta Audio (Blob)
      // Converte la risposta binaria in un URL oggetto temporaneo per l'elemento <audio>
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      setOutputAudio(audioUrl);
    } catch (err) {
      console.error("Errore di generazione:", err);
      // Aggiorna lo stato di errore per la visualizzazione all'utente
      setError(err.message || "Generazione fallita per un errore di rete.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 ">
      {/* Navbar fissa in alto */}
      <header className="max-w-full ">
        <Navbar page={page} setPage={setPage} />
      </header>
      <main className="max-w-full mx-auto flex flex-col justify-center lg:flex-row gap-8 mt-10">
        {/* Pannello di Input e Controlli */}
        {page === "tts" && (
          <div className="lg:w-1/2">
            <TtsControlPanel onGenerate={handleGenerate} isLoading={loading} />
          </div>
        )}

        {/* Visualizzazione dell'Output Audio */}
        {page === "output" && (
          <div className="lg:w-1/2">
            <AudioOutput
              outputAudio={outputAudio}
              isLoading={loading}
              error={error}
            />
          </div>
        )}
      </main>

      <footer className="text-center pt-8 text-sm text-gray-500">
        <p>Sviluppato da Raffaele Tarantino</p>
      </footer>
    </div>
  );
}

export default App;
