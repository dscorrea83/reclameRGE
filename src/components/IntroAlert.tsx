import React from 'react';
import { AlertTriangle, Mail, Info, FileText, ArrowRight } from 'lucide-react';

export const IntroAlert: React.FC = () => {
  return (
    <section className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
              Notificação Procon Taquara
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Concessionária RGE Sul
            </span>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            O <strong>Procon de Taquara</strong> notificou formalmente a RGE após receber dezenas de queixas de moradores sobre aumentos desproporcionais nas faturas de energia elétrica, com relatos de subidas de até <strong>500%</strong>. A concessionária tem prazo até <strong>18 de setembro</strong> para apresentar explicações técnicas e demonstrativos de faturamento.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-sm text-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Mail className="w-4 h-4 text-[#2c5f8a]" />
              <span>Como o Procon orienta o cidadão a registrar a contestação:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 pl-6">
              A reclamação pode ser enviada por <strong>e-mail</strong> ao Procon, anexando a <strong>conta que você deseja contestar e mais duas anteriores</strong> (totalizando 3 faturas para cálculo da média). Esta ferramenta processa as 3 contas, verifica se o aumento excede o teto da Aneel (14,11%) e gera a petição pronta para envio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="flex items-center gap-2 p-2 rounded bg-blue-50/60 border border-blue-100 text-blue-900">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>1. Baixe os 3 PDFs no portal da RGE</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-blue-50/60 border border-blue-100 text-blue-900">
              <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>2. Envie ou digite os valores e kWh</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-emerald-50/60 border border-emerald-100 text-emerald-900">
              <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>3. Obtenha o laudo e modelo de e-mail</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
