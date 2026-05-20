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
  const [exported, setExported] = useState(false);
  const [pdfExporting, setPdfExporting] = useState(false);

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

  const handleExportMarkdown = () => {
    const getFeaturesMd = () => (spec.features || []).map((f) => `- ${f}`).join("\n");
    const getFlowsMd = () =>
      (spec.flows || [])
        .map(
          (f) =>
            `### ${f.name}\n\n**Pasos del flujo:**\n${f.steps
              .map((s, i) => `${i + 1}. ${s}`)
              .join("\n")}${
              f.error_path ? `\n\n**Flujo alternativo / Error:**\n${f.error_path}` : ""
            }`
        )
        .join("\n\n---\n\n");

    // Generar un título limpio para el archivo
    const titleSeed = spec.vision ? spec.vision.split(/[.\n]/)[0] : "especificacion";
    const sanitizedTitle = titleSeed
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/[^a-z0-9]+/g, "-")      // Cambiar caracteres no alfanuméricos por guiones
      .replace(/(^-|-$)+/g, "")       // Eliminar guiones sobrantes
      .substring(0, 50);

    const markdownText = `# Especificación Técnica: ${titleSeed.substring(0, 80)}

## 1. Visión del Producto
${spec.vision || "*No especificada*"}

## 2. Usuarios Objetivo
${spec.users || "*No especificados*"}

## 3. Funcionalidades Principales
${spec.features && spec.features.length > 0 ? getFeaturesMd() : "*No especificadas*"}

## 4. Flujos de Usuario
${spec.flows && spec.flows.length > 0 ? getFlowsMd() : "*No especificados*"}

## 5. Arquitectura Técnica
${spec.architecture || "*No especificada*"}

## 6. Requisitos Técnicos
${spec.requirements || "*No especificados*"}
`.trim();

    const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `especificacion-${sanitizedTitle || "tecnica"}.md`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const handleExportPDF = () => {
    const titleSeed = spec.vision ? spec.vision.split(/[.\n]/)[0] : "Especificación Técnica";
    const projectName = titleSeed.substring(0, 80);

    const featuresHtml = (spec.features || [])
      .map((f) => `<li>${f}</li>`)
      .join("");

    const flowsHtml = (spec.flows || [])
      .map(
        (f, idx) => `
        <div class="flow-card">
          <h3>${idx + 1}. ${f.name}</h3>
          <strong>Pasos del flujo:</strong>
          <ol>
            ${f.steps.map((s) => `<li>${s}</li>`).join("")}
          </ol>
          ${
            f.error_path
              ? `<div class="error-path"><strong>Flujo alternativo / Error:</strong> ${f.error_path}</div>`
              : ""
          }
        </div>
      `
      )
      .join("");

    // Create a temporary hidden iframe for printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      console.error("No se pudo acceder al documento del iframe");
      return;
    }

    setPdfExporting(true);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Especificación Técnica - ${projectName}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            line-height: 1.6;
            padding: 0;
            margin: 0;
          }
          h1 {
            font-size: 24px;
            color: #0f172a;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 12px;
            margin-top: 0;
            margin-bottom: 24px;
          }
          h2 {
            font-size: 18px;
            color: #1e3a8a;
            margin-top: 24px;
            margin-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
            page-break-after: avoid;
          }
          h3 {
            font-size: 14px;
            color: #1e293b;
            margin-top: 0;
            margin-bottom: 8px;
          }
          p {
            margin-top: 0;
            margin-bottom: 12px;
            font-size: 13px;
          }
          ul, ol {
            margin-top: 0;
            margin-bottom: 16px;
            padding-left: 20px;
            font-size: 13px;
          }
          li {
            margin-bottom: 4px;
          }
          .flow-card {
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 12px;
            background-color: #f8fafc;
            page-break-inside: avoid;
          }
          .error-path {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #e2e8f0;
            font-size: 12px;
            color: #b45309;
          }
          .section-box {
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            padding: 12px;
            border-radius: 0 6px 6px 0;
            margin-bottom: 16px;
            font-size: 13px;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          @media print {
            .flow-card {
              background-color: #f8fafc !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .section-box {
              background-color: #f8fafc !important;
              border-left: 4px solid #3b82f6 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <h1>Especificación Técnica: ${projectName}</h1>
        
        <h2>1. Visión del Producto</h2>
        <div class="section-box">
          ${spec.vision || "No especificada"}
        </div>

        <h2>2. Usuarios Objetivo</h2>
        <div class="section-box" style="border-left-color: #10b981;">
          ${spec.users || "No especificados"}
        </div>

        <h2>3. Funcionalidades Principales</h2>
        <ul>
          ${featuresHtml || "<li>No especificadas</li>"}
        </ul>

        <h2>4. Flujos de Usuario</h2>
        <div class="flows-container">
          ${flowsHtml || "<p>No especificados</p>"}
        </div>

        <div class="grid-2">
          <div>
            <h2>5. Arquitectura Técnica</h2>
            <div class="section-box" style="border-left-color: #8b5cf6;">
              ${spec.architecture || "No especificada"}
            </div>
          </div>
          <div>
            <h2>6. Requisitos Técnicos</h2>
            <div class="section-box" style="border-left-color: #f43f5e;">
              ${spec.requirements || "No especificados"}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        setPdfExporting(false);
      }, 1000);
    }, 500);
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
      className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all focus:ring-4 focus:ring-slate-200 active:scale-[0.98]"
    >
      {copied ? (
        <>
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span>¡Copiado!</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
          <span>Copiar completa</span>
        </>
      )}
    </button>
  );

  const ExportButton = () => (
    <button
      onClick={handleExportMarkdown}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all focus:ring-4 focus:ring-emerald-100 shadow-sm shadow-emerald-600/10 hover:shadow-md hover:shadow-emerald-600/20 active:scale-[0.98]"
    >
      {exported ? (
        <>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span>¡Descargado!</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          <span>Exportar a Markdown</span>
        </>
      )}
    </button>
  );

  const ExportPDFButton = () => (
    <button
      onClick={handleExportPDF}
      disabled={pdfExporting}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-all focus:ring-4 focus:ring-indigo-100 shadow-sm shadow-indigo-600/10 hover:shadow-md hover:shadow-indigo-600/20 active:scale-[0.98] disabled:cursor-not-allowed"
    >
      {pdfExporting ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Preparando PDF...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          <span>Exportar a PDF</span>
        </>
      )}
    </button>
  );

  return (
    <div className="w-full bg-white shadow-xl shadow-slate-200/50 border border-slate-200 rounded-2xl p-6 md:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-10">
      
      {/* ACTION BUTTONS (TOP) */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 border-b border-slate-100 pb-6 mb-6">
        <ExportPDFButton />
        <ExportButton />
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

      {/* ACTION BUTTONS (BOTTOM) */}
      <div className="pt-8 flex flex-col sm:flex-row justify-center gap-3 border-t border-slate-100">
        <ExportPDFButton />
        <ExportButton />
        <CopyFullButton />
      </div>

    </div>
  );
}
