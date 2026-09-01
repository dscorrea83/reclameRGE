import React from 'react';
import { AlertCircle, Mail, Info, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

export const IntroAlert: React.FC = () => {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-[#1a3a5f] flex-shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 text-[#2c5f8a]" />
        </div>
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-blue-100 text-blue-900 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
              Notificação Procon Taquara
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Concessionária RGE Sul
            </span>
          </div>

          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            O <strong>Procon de Taquara</strong> notificou a concessionária RGE após receber queixas de munícipes sobre aumentos expressivos nas faturas de energia elétrica. A concessionária tem prazo até <strong>18 de setembro</strong> para prestar esclarecimentos e demonstrativos técnicos.
          </p>

          {/* Legal / Methodological Clarity Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#2c5f8a]" />
              <span>Como funciona esta ferramenta de triagem:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
              A ferramenta compara os dados informados pelo consumidor com um <strong>percentual tarifário de referência</strong>, considerando o período, a classe residencial e a vigência informada. O resultado é preliminar e <strong>não determina a existência de cobrança indevida</strong>.
            </p>
            <p className="text-xs text-slate-500 pl-6">
              Para o reajuste tarifário residencial de 2025, a RGE divulgou o percentual de <strong>14,11%</strong> (vigência a partir de 19/06/2025 - Res. Homologatória nº 3.473/2025). Para 2026, vigora a Resolução Homologatória nº 3.590/2026 (~<strong>14,97%</strong> residencial). Para outros anos, classes ou períodos, o percentual pode ser diferente.
            </p>
          </div>

          {/* 3 Step Sequence */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-blue-950">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>1. Reúna a fatura recente e anteriores</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-blue-950">
              <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>2. Confira consumo (kWh), valor e datas</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-950">
              <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>3. Obtenha a triagem e modelo de pedido</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
