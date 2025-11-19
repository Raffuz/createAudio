import React, { useState } from "react";
import { SUPPORTED_LANGUAGES } from "./config";

const TtsControlPanel = ({ onGenerate, isLoading }) => {
  const [text, setText] = useState(
    "Il mese scorso abbiamo raggiunto un nuovo traguardo: due miliardi di visualizzazioni sul nostro canale YouTube."
  );
  const [languageId, setLanguageId] = useState("it");
  const [audioPromptFile, setAudioPromptFile] = useState(null);
  const [exaggeration, setExaggeration] = useState(0.5);
  const [cfgWeight, setCfgWeight] = useState(0.5);
  const [temperature, setTemperature] = useState(0.8);
  const [seed, setSeed] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {
      text,
      language_id: languageId,
      audio_prompt_file: audioPromptFile,
      exaggeration,
      cfg_weight: cfgWeight,
      temperature,
      seed,
    };
    onGenerate(params);
  };

  const handleFileChange = (e) => {
    setAudioPromptFile(e.target.files.length > 0 ? e.target.files[0] : null);
  };

  const inputClasses =
    "w-full p-3 border border-gray-600 rounded-lg bg-gray-800 focus:ring-blue-500 focus:border-blue-500 text-gray-100 transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="bg-blue-500/10 p-6 rounded-xl shadow-2xl h-full w-full">
      <h2 className="text-2xl font-semibold mb-6 text-blue-400">
        Controlli di Sintesi
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Testo */}
        <div>
          <label htmlFor="text" className={labelClasses}>
            Testo da sintetizzare (max 800 caratteri)
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value.substring(0, 800))}
            rows={4}
            className={inputClasses + " resize-none"}
            required
          />
        </div>

        {/* Lingua */}
        <div>
          <label htmlFor="language" className={labelClasses}>
            Lingua
          </label>
          <select
            id="language"
            value={languageId}
            onChange={(e) => setLanguageId(e.target.value)}
            className={inputClasses}
            required
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>
                {name} ({code})
              </option>
            ))}
          </select>
        </div>

        {/* Audio Prompt */}
        <div>
          <label htmlFor="audio-prompt" className={labelClasses}>
            Audio di Riferimento (Voce Target - Opzionale)
          </label>
          <input
            id="audio-prompt"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full 
                       file:border-0 file:text-sm file:font-semibold 
                       file:bg-blue-600 hover:file:bg-blue-700 file:text-white transition-colors"
          />
          {audioPromptFile && (
            <p className="mt-2 text-xs text-gray-400">
              File selezionato:{" "}
              <span className="font-mono">{audioPromptFile.name}</span>
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Nota: Imposta CFG/Pace a 0 per mitigare il trasferimento di accento.
          </p>
        </div>

        {/* Slider: Exaggeration */}
        <div>
          <label htmlFor="exaggeration" className={labelClasses}>
            Exaggeration:
            <span className="font-bold text-blue-400">
              {exaggeration.toFixed(2)}
            </span>{" "}
            (0.25 - 2.0)
          </label>
          <input
            id="exaggeration"
            type="range"
            min="0.25"
            max="2.0"
            step="0.05"
            value={exaggeration}
            onChange={(e) => setExaggeration(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Slider: CFG/Pace */}
        <div>
          <label htmlFor="cfg-weight" className={labelClasses}>
            CFG/Pace:
            <span className="font-bold text-blue-400">
              {cfgWeight.toFixed(2)}
            </span>{" "}
            (0.2 - 1.0)
          </label>
          <input
            id="cfg-weight"
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={cfgWeight}
            onChange={(e) => setCfgWeight(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Opzioni Avanzate */}
        <details className="p-4 rounded-lg bg-gray-700 text-gray-300">
          <summary className="font-semibold cursor-pointer">
            Opzioni Avanzate
          </summary>

          <div className="mt-4 space-y-4">
            {/* Slider: Temperature */}
            <div>
              <label htmlFor="temperature" className={labelClasses}>
                Temperatura:
                <span className="font-bold text-blue-400">
                  {temperature.toFixed(2)}
                </span>{" "}
                (0.05 - 5.0)
              </label>
              <input
                id="temperature"
                type="range"
                min="0.05"
                max="5.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg cursor-pointer"
              />
            </div>

            {/* Input: Seed */}
            <div>
              <label htmlFor="seed" className={labelClasses}>
                Seed Casuale (0 per casuale)
              </label>
              <input
                id="seed"
                type="number"
                value={seed}
                onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                className={inputClasses}
              />
            </div>
          </div>
        </details>

        {/* Pulsante Genera */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-xl text-lg font-bold transition-all ${
            isLoading
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          }`}
        >
          {isLoading ? "Generazione in corso..." : "Genera Audio"}
        </button>
      </form>
    </div>
  );
};

export default TtsControlPanel;
