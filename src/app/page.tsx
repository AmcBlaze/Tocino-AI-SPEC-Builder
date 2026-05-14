"use client";

import { useState } from "react";
import SpecForm from "@/components/SpecForm";
import SpecOutput from "@/components/SpecOutput";

export default function Home() {
  const [specResult, setSpecResult] = useState<any>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl w-full space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Tocino AI <span className="text-blue-600">SPEC Builder</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Convierte tu idea de producto en una especificación técnica detallada en segundos.
          </p>
        </div>

        <SpecForm onResult={(spec) => setSpecResult(spec)} />

        {specResult && (
          <SpecOutput spec={specResult} />
        )}
      </div>
    </div>
  );
}
