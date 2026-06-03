"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import SpecForm from "@/components/SpecForm";
import SpecOutput from "@/components/SpecOutput";
import HistorySidebar, { HistoryItem } from "@/components/HistorySidebar";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-xs font-mono">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <LandingPage />;
  }

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

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="px-6 py-5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-5.5 h-5.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Tocino AI <span className="text-blue-500">SPEC Builder</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer">
                Iniciar Sesión
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-md shadow-blue-600/15 cursor-pointer">
                Comenzar gratis
              </button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 font-mono tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Potenciado por Gemini 2.5 Flash
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            De la idea al Spec Técnico <br className="hidden sm:inline" /> en segundos con Inteligencia Artificial
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Describe tu producto en lenguaje sencillo. Generamos al instante una especificación técnica impecable con arquitectura, flujos detallados y casos de uso listos para desarrollo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <SignUpButton mode="modal">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                Crear mi Spec Gratis
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold rounded-xl transition-all cursor-pointer">
                Iniciar Sesión
              </button>
            </SignInButton>
          </div>

          <p className="text-xs text-slate-500 font-mono">No requiere tarjeta de crédito • Historial guardado localmente</p>
          
          {/* Mock Dashboard Preview */}
          <div className="relative max-w-4xl mx-auto pt-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl -z-10" />
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-6 text-left">
              {/* Sidebar Mock */}
              <div className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 pr-0 md:pr-6 space-y-4">
                <div className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider">Historial Reciente</div>
                <div className="space-y-2">
                  <div className="p-2 bg-blue-900/20 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium cursor-default">App de Delivery de Comida</div>
                  <div className="p-2 hover:bg-slate-800/50 text-slate-400 rounded-lg text-xs font-medium cursor-default">E-Commerce de Arte</div>
                  <div className="p-2 hover:bg-slate-800/50 text-slate-400 rounded-lg text-xs font-medium cursor-default">Plataforma SaaS Inmobiliario</div>
                </div>
              </div>

              {/* Main Preview Mock */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="font-semibold text-slate-200">Especificación Técnica Generada</div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-slate-800 text-[10px] font-mono text-slate-400 rounded">MD</span>
                    <span className="px-2 py-1 bg-slate-800 text-[10px] font-mono text-slate-400 rounded">PDF</span>
                  </div>
                </div>
                <div className="space-y-4 font-sans">
                  <div>
                    <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">1. Visión del Producto</h4>
                    <p className="text-sm text-slate-300 mt-1">Una aplicación móvil que conecta repartidores autónomos con restaurantes locales utilizando geolocalización en tiempo real y asignación optimizada de rutas.</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">2. Funcionalidades Clave</h4>
                    <ul className="text-sm text-slate-300 list-disc list-inside mt-1 space-y-1">
                      <li>El usuario puede buscar restaurantes cercanos según tipo de cocina.</li>
                      <li>El repartidor puede aceptar pedidos entrantes mediante un mapa interactivo.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="bg-slate-950 border-t border-slate-900 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-white">Diseñado para Emprendedores y Creadores</h2>
              <p className="text-slate-400 font-light">Todo lo necesario para estructurar tu idea y comunicarla a tu primer desarrollador sin ambigüedades.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-blue-500/30 transition-all hover:scale-[1.01] group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Entendimiento de IA</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">Nuestra IA traduce tu idea informal en requerimientos técnicos estructurados, flujos detallados de usuario y sugerencias de arquitectura.</p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-blue-500/30 transition-all hover:scale-[1.01] group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Exportación Flexible</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">Descarga el spec generado en formato Markdown para documentar en Notion/GitHub, o en un PDF maquetado para impresiones profesionales.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-blue-500/30 transition-all hover:scale-[1.01] group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Historial Seguro</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">Tus especificaciones previas persisten en el almacenamiento local de tu navegador sin necesidad de sincronización externa en la nube.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-slate-950/50 py-20 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-white">¿Cómo Funciona?</h2>
              <p className="text-slate-400 font-light">Tres pasos sencillos para estructurar tu especificación técnica de extremo a extremo.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Step 1 */}
              <div className="space-y-4 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-650 text-white flex items-center justify-center font-bold mx-auto shadow-md shadow-blue-600/20">1</div>
                <h4 className="font-bold text-white text-lg">Describe tu Idea</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-light">Completa el formulario describiendo la visión de tu aplicación, tu público y las funcionalidades primordiales.</p>
              </div>

              {/* Step 2 */}
              <div className="space-y-4 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-650 text-white flex items-center justify-center font-bold mx-auto shadow-md shadow-blue-600/20">2</div>
                <h4 className="font-bold text-white text-lg">La IA Genera el Spec</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-light font-sans">Nuestros prompts estructurados instruyen a Gemini a redactar el diseño arquitectónico detallado en cuestión de segundos.</p>
              </div>

              {/* Step 3 */}
              <div className="space-y-4 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-650 text-white flex items-center justify-center font-bold mx-auto shadow-md shadow-blue-600/20">3</div>
                <h4 className="font-bold text-white text-lg">Exporta y Construye</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-light">Copia los resultados, descárgalos como PDF formal y compártelos con programadores para obtener una cotización sin desvíos.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 font-mono tracking-wider">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 Tocino AI SPEC Builder. Todos los derechos reservados.</div>
          <div className="flex gap-4">
            <span className="text-slate-600">v1.2</span>
            <span>Gemini 2.5 Flash</span>
            <span>Clerk Auth</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

