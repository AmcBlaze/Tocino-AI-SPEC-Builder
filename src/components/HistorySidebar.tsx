"use client";

import { useState } from "react";

export interface HistoryItem {
  id: string;
  projectName: string;
  timestamp: number;
  spec: any;
}

interface HistorySidebarProps {
  history: HistoryItem[];
  selectedId: string | null;
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export default function HistorySidebar({
  history,
  selectedId,
  onSelect,
  onDelete,
  onClearAll,
  isOpen,
  onToggleOpen,
}: HistorySidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const filteredHistory = history.filter((item) =>
    item.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de que quieres eliminar esta especificación del historial?")) {
      onDelete(id);
    }
  };

  const handleClearAllClick = () => {
    if (showConfirmClear) {
      onClearAll();
      setShowConfirmClear(false);
    } else {
      setShowConfirmClear(true);
      setTimeout(() => setShowConfirmClear(false), 4000); // Reset confirm state after 4 seconds
    }
  };

  return (
    <>
      {/* MOBILE BACKDROP Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onToggleOpen}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`fixed inset-y-0 left-0 z-45 w-80 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:hidden"
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-400 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="font-bold text-lg tracking-wide text-white">
              Historial de Specs
            </h2>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700/50">
            {history.length}/20
          </span>
        </div>

        {/* SEARCH BAR */}
        <div className="p-4 border-b border-slate-800/60 bg-slate-950/20">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
              placeholder="Buscar por proyecto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* LIST AREA */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
              <svg
                className="w-10 h-10 text-slate-700 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-xs font-medium">
                {searchTerm
                  ? "No se encontraron resultados"
                  : "No hay especificaciones guardadas"}
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isActive = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className={`group relative flex items-center justify-between p-3.5 rounded-xl cursor-pointer border transition-all duration-200 hover:scale-[0.99] select-none ${
                    isActive
                      ? "bg-slate-800 border-blue-500/70 text-white shadow-lg shadow-blue-500/5"
                      : "bg-slate-950/40 border-slate-900 hover:bg-slate-900/50 hover:border-slate-800 text-slate-300 hover:text-slate-100"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 pr-6">
                    <svg
                      className={`w-4 h-4 mt-1 shrink-0 ${
                        isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate leading-snug">
                        {item.projectName}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">
                        {formatDate(item.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteClick(e, item.id)}
                    className="absolute right-3.5 opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all duration-200"
                    title="Eliminar especificación"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* SIDEBAR FOOTER */}
        {history.length > 0 && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
            <button
              onClick={handleClearAllClick}
              className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-2 focus:ring-4 ${
                showConfirmClear
                  ? "bg-red-600 border-red-500 text-white hover:bg-red-700 focus:ring-red-500/20 animate-pulse"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-950/30 hover:bg-red-950/5 focus:ring-slate-800"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>
                {showConfirmClear ? "¡Haz clic para confirmar!" : "Vaciar historial"}
              </span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
