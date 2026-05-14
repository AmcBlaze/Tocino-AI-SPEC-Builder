"use client";

import { useState } from "react";

interface SpecFormProps {
  onResult: (spec: any) => void;
}

export default function SpecForm({ onResult }: SpecFormProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-spec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al generar la especificación");
      }

      // Si Gemini devuelve el JSON envuelto de nuevo, lo desestructuramos
      const specToReturn = data.spec?.spec || data.spec || data;
      onResult(specToReturn);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado al procesar tu solicitud.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex flex-col gap-3">
          <label htmlFor="prompt" className="text-base font-semibold text-gray-800">
            ¿Qué quieres construir?
          </label>
          <textarea
            id="prompt"
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-none outline-none disabled:bg-gray-50 disabled:text-gray-400 text-gray-800 transition-all shadow-inner"
            placeholder="Describe tu idea de producto... Por ejemplo: una app para que freelancers gestionen sus facturas"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-sm"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generando...</span>
              </>
            ) : (
              <span>Generar especificación</span>
            )}
          </button>

          {error && (
            <div className="w-full p-4 mt-2 text-sm text-red-700 bg-red-50 rounded-lg text-center border border-red-200">
              {error}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
