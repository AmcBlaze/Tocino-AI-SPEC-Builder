"use client";

import { useState } from "react";

interface Flow {
  name: string;
  steps: string[];
  error_path: string;
}

interface Spec {
  vision?: string;
  users?: string;
  features?: string[];
  flows?: Flow[];
  architecture?: string;
  requirements?: string;
}

interface SpecOutputProps {
  spec: Spec;
}

export default function SpecOutput({ spec }: SpecOutputProps) {
  const [copied, setCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const getFeaturesText = () => (spec.features || []).map((f) => `- ${f}`).join("\n");
  const getFlowsText = () => (spec.flows || []).map((f) => `${f.name}\n${f.steps.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}\n  Error: ${f.error_path}`).join("\n\n");

  const handleCopy = () => {
    const text = `
Visión del Producto
${spec.vision || ""}

Usuarios Objetivo
${spec.users || ""}

Funcionalidades Principales
${getFeaturesText()}

Flujos de Usuario
${getFlowsText()}

Arquitectura Técnica
${spec.architecture || ""}

Requisitos Técnicos
${spec.requirements || ""}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySection = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Iconos SVG reutilizables
  const Icons = {
    Vision: (
      <svg className="w-6 h-6 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    ),
    Users: (
      <svg className="w-6 h-6 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    ),
    Features: (
      <svg className="w-6 h-6 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
    ),
    Flows: (
      <svg className="w-6 h-6 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
    ),
    Architecture: (
      <svg className="w-6 h-6 text-purple-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
    ),
    Requirements: (
      <svg className="w-6 h-6 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
  };

  const SectionCopyButton = ({ text, id }: { text: string, id: string }) => (
    <button
      onClick={() => handleCopySection(text, id)}
      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
      title="Copiar sección"
    >
      {copiedSection === id ? (
        <>
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="text-emerald-700">¡Copiado!</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
          <span>Copiar</span>
        </>
      )}
    </button>
  );

  const CopyFullButton = () => (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all focus:ring-4 focus:ring-slate-200"
    >
      {copied ? (
        <>
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span>¡Copiado!</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
          <span>Copiar especificación completa</span>
        </>
      )}
    </button>
  );

  return (
    <div className="w-full bg-white shadow-xl shadow-slate-200/50 border border-slate-200 rounded-2xl p-6 md:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-10">
      
      {/* ACTION BUTTON (TOP) */}
      <div className="flex justify-end border-b border-slate-100 pb-6 mb-6">
        <CopyFullButton />
      </div>

      {/* HEADER & VISION */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          {Icons.Vision}
          <h2 className="text-2xl font-bold text-slate-900">Visión del Producto</h2>
          <SectionCopyButton text={spec.vision || ""} id="vision" />
        </div>
        <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <p className="text-lg text-slate-700 leading-relaxed font-medium">
            {spec.vision}
          </p>
        </div>
      </div>

      {/* USERS */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          {Icons.Users}
          <h2 className="text-2xl font-bold text-slate-900">Usuarios Objetivo</h2>
          <SectionCopyButton text={spec.users || ""} id="users" />
        </div>
        <div className="grid gap-4 sm:grid-cols-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-slate-800 mb-2">Perfil y Casos de Uso</h3>
            <p className="text-slate-600 leading-relaxed">{spec.users}</p>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          {Icons.Features}
          <h2 className="text-2xl font-bold text-slate-900">Funcionalidades Principales</h2>
          <SectionCopyButton text={getFeaturesText()} id="features" />
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {spec.features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* FLOWS */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          {Icons.Flows}
          <h2 className="text-2xl font-bold text-slate-900">Flujos de Usuario</h2>
          <SectionCopyButton text={getFlowsText()} id="flows" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {spec.flows?.map((flow, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="bg-slate-50 border-b border-slate-100 p-4 font-semibold text-slate-800 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs">{idx + 1}</span>
                {flow.name}
              </div>
              <div className="p-5 flex-1 space-y-4">
                <ol className="relative border-l border-slate-200 ml-3 space-y-4">
                  {flow.steps?.map((step, stepIdx) => (
                    <li key={stepIdx} className="pl-6 relative">
                      <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-white"></span>
                      <span className="text-slate-600 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              {flow.error_path && (
                <div className="bg-amber-50/50 p-4 border-t border-amber-100">
                  <div className="flex items-start gap-2 text-sm text-amber-800">
                    <svg className="w-5 h-5 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <div>
                      <span className="font-semibold block mb-0.5">Flujo Alternativo / Error:</span>
                      {flow.error_path}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ARCHITECTURE & REQUIREMENTS */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            {Icons.Architecture}
            <h2 className="text-xl font-bold text-slate-900">Arquitectura Técnica</h2>
            <SectionCopyButton text={spec.architecture || ""} id="architecture" />
          </div>
          <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100">
            <p className="text-slate-700 leading-relaxed text-sm">
              {spec.architecture}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            {Icons.Requirements}
            <h2 className="text-xl font-bold text-slate-900">Requisitos Técnicos</h2>
            <SectionCopyButton text={spec.requirements || ""} id="requirements" />
          </div>
          <div className="bg-rose-50/50 p-5 rounded-xl border border-rose-100">
            <p className="text-slate-700 leading-relaxed text-sm">
              {spec.requirements}
            </p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTON (BOTTOM) */}
      <div className="pt-8 flex justify-center border-t border-slate-100">
        <CopyFullButton />
      </div>

    </div>
  );
}
