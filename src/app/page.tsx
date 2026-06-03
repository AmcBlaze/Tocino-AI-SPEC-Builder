"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import SpecForm from "@/components/SpecForm";
import SpecOutput from "@/components/SpecOutput";
import HistorySidebar, { HistoryItem } from "@/components/HistorySidebar";

export default function Home() {
  const [specResult, setSpecResult] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load history from localStorage on client-side mount
  useEffect(() => {
    const saved = localStorage.getItem("tocino_spec_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Error al parsear el historial de localStorage", e);
      }
    }
  }, []);

  const handleResult = (spec: any) => {
    setSpecResult(spec);
    setSelectedId(null); // Clear selected state for newly generated spec

    // Get a short and descriptive project name
    let projectName = "Proyecto sin nombre";
    if (spec.title && typeof spec.title === "string") {
      projectName = spec.title.trim();
    } else {
      const titleSeed = spec.vision ? spec.vision.split(/[.\n]/)[0] : "Especificación Técnica";
      // Remove common introductory filler phrases in Spanish
      let cleaned = titleSeed
        .replace(/^(esta\s+aplicación\s+(móvil|web)?\s+(busca|es|pretende|quiere|permite|se\s+centra|consiste|sirve)\s+(para\s+)?)/i, "")
        .replace(/^(este\s+(sistema|producto|software|saas|proyecto)\s+(busca|es|pretende|quiere|permite|se\s+centra|consiste|sirve)\s+(para\s+)?)/i, "")
        .replace(/^(el\s+producto\s+(es|busca|pretende|quiere|permite)\s+(una\s+plataforma|un\s+sistema|un\s+saas|una\s+app|para\s+)?)/i, "")
        .replace(/^(plataforma\s+para\s+)/i, "")
        .replace(/^(aplicación\s+para\s+)/i, "")
        .trim();
      
      if (cleaned.length > 0) {
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      }
      projectName = cleaned.substring(0, 35) || "Especificación Técnica";
    }

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      projectName,
      timestamp: Date.now(),
      spec,
    };

    setHistory((prev) => {
      // Avoid duplicate project names to keep history clean
      const filtered = prev.filter((item) => item.projectName !== projectName);
      const updated = [newItem, ...filtered];
      // FIFO limit of 20 elements to protect localStorage quota
      const pruned = updated.slice(0, 20);
      
      localStorage.setItem("tocino_spec_history", JSON.stringify(pruned));
      return pruned;
    });
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setSpecResult(item.spec);
    setSelectedId(item.id);
    
    // Automatically close sidebar on mobile/tablet for focused reading
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("tocino_spec_history", JSON.stringify(updated));
      return updated;
    });

    if (selectedId === id) {
      setSpecResult(null);
      setSelectedId(null);
    }
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem("tocino_spec_history");
    setSpecResult(null);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans overflow-hidden">
      
      {/* SIDEBAR FOR SAVED SPECS */}
      <HistorySidebar
        history={history}
        selectedId={selectedId}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearAllHistory}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden transition-all duration-300">
        
        {/* HEADER TOOLBAR */}
        <header className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              title={isSidebarOpen ? "Ocultar historial" : "Mostrar historial"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isSidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <div className="font-semibold text-slate-800 tracking-tight">
              Tocino AI <span className="text-blue-600">SPEC Builder</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-semibold text-slate-500 tracking-wider font-mono">ONLINE</span>
            </div>
            <UserButton />
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          <div className="max-w-4xl w-full mx-auto space-y-10">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
                Tocino AI <span className="text-blue-600">SPEC Builder</span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Convierte tu idea de producto en una especificación técnica detallada en segundos.
              </p>
            </div>

            {!selectedId ? (
              <SpecForm onResult={handleResult} />
            ) : (
              <div className="flex justify-center pb-2 animate-in fade-in duration-300">
                <button
                  onClick={() => {
                    setSelectedId(null);
                    setSpecResult(null);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg focus:ring-4 focus:ring-blue-100"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Crear Nueva Especificación</span>
                </button>
              </div>
            )}

            {specResult && (
              <SpecOutput spec={specResult} />
            )}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="py-5 border-t border-slate-200 bg-white text-center text-xs text-slate-400 font-mono tracking-wider shrink-0 shadow-sm z-30">
          version 1.2 - update 25-05-2026 16:50
        </footer>
      </div>
    </div>
  );
}

