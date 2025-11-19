import React from "react";

const AudioOutput = ({ outputAudio, isLoading, error }) => {
  return (
    <div className="bg-blue-500/10 p-6 rounded-xl shadow-2xl h-full flex flex-col">
      <h2 className="text-2xl font-semibold mb-6 text-blue-400">
        Output Audio
      </h2>

      <div className=" flex flex-col items-center justify-center min-h-[200px] border border-dashed border-gray-700 p-4 rounded-lg">
        {/* Gestione degli Errori */}
        {error && (
          <div className="text-center p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-400 font-semibold mb-2">
              Errore di Generazione
            </p>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Stato di Caricamento (Spinner SVG) */}
        {isLoading && (
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-400 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-blue-400 font-medium">
              Sintesi in corso... attendi.
            </p>
          </div>
        )}

        {/* Output Audio Riuscito */}
        {outputAudio && !isLoading && !error && (
          <div className="w-full text-center">
            <audio controls src={outputAudio} className="w-full mb-4">
              Il tuo browser non supporta l'elemento audio.
            </audio>
            <a
              href={outputAudio}
              download="chatterbox_output.wav"
              className="text-sm text-blue-400 hover:text-blue-400 underline"
            >
              Scarica Audio (.wav)
            </a>
          </div>
        )}

        {/* Messaggio Iniziale */}
        {!outputAudio && !isLoading && !error && (
          <p className="text-gray-500 italic">
            Il risultato della sintesi vocale apparirà qui.
          </p>
        )}
      </div>
    </div>
  );
};

export default AudioOutput;
