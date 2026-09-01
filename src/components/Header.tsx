import React, { useState } from 'react';
import { ShieldCheck, CalendarClock, BookOpen, Info } from 'lucide-react';
import { BlogLogo } from './BlogLogo';
import { MetodologiaModal } from './MetodologiaModal';
import { BASE_TARIFARIA_DATA_ATUALIZACAO } from '../utils/calculator';

export const Header: React.FC = () => {
  const [isMetodologiaOpen, setIsMetodologiaOpen] = useState(false);

  return (
    <>
      <header className="bg-[#1a3a5f] text-white border-b border-blue-900/40 shadow-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <BlogLogo size="md" />
            <div>
              <div className="font-bold text-lg sm:text-xl leading-tight tracking-tight flex items-center gap-2 flex-wrap">
                <span className="text-white">Taquara em Foco</span>
                <span className="hidden sm:inline text-blue-300/50 font-normal">|</span>
                <span className="text-amber-400 text-xs sm:text-sm font-semibold tracking-normal">
                  Cidadão-Pesquisador Atento
                </span>
              </div>
              <p className="text-xs text-blue-200/90 font-medium">
                Ferramenta de triagem, conferência e organização de documentos para contas de energia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            <button
              type="button"
              onClick={() => setIsMetodologiaOpen(true)}
              className="bg-blue-900/80 hover:bg-blue-800 border border-blue-400/40 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-blue-100 transition-colors shadow-2xs font-medium"
              title="Entenda como os cálculos e percentuais são apurados"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Metodologia & Regras</span>
            </button>

            <div className="bg-emerald-950/70 border border-emerald-400/30 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Base ANEEL: <strong>{BASE_TARIFARIA_DATA_ATUALIZACAO}</strong></span>
            </div>
          </div>
        </div>
      </header>

      <MetodologiaModal
        isOpen={isMetodologiaOpen}
        onClose={() => setIsMetodologiaOpen(false)}
      />
    </>
  );
};
