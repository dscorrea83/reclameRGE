import React from 'react';
import { ShieldAlert, CalendarClock } from 'lucide-react';
import { BlogLogo } from './BlogLogo';

export const Header: React.FC = () => {
  return (
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
              Serviço público de utilidade: calculadora e contestação da sua conta de luz
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div className="bg-blue-950/70 border border-blue-400/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-blue-200">
            <CalendarClock className="w-3.5 h-3.5 text-amber-300" />
            <span>Prazo RGE: <strong>18/Setembro</strong></span>
          </div>
          <div className="bg-emerald-950/70 border border-emerald-400/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-emerald-200">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reajuste Aneel: <strong>14,11%</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
};
