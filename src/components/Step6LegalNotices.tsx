import React from 'react';
import { ShieldCheck, Info, HelpCircle, PhoneCall, Building2, MapPin, Mail, ExternalLink, Scale } from 'lucide-react';

export const Step6LegalNotices: React.FC = () => {
  return (
    <section id="step6-legal-section" className="bg-[#fff8f0] rounded-xl border border-[#f0d9b5] p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1a3a5f] text-white font-bold text-sm">
          6
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-[#1a3a5f]">
          Orientações, canais de atendimento e ressalvas legais
        </h2>
      </div>

      {/* Main Disclaimer Banner (Item 1) */}
      <div className="p-4 bg-white/90 border border-amber-300/80 rounded-xl text-xs sm:text-sm text-slate-800 space-y-2 leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <Scale className="w-4 h-4 text-amber-700" />
          <span>Aviso Legal e Natureza da Ferramenta:</span>
        </div>
        <p className="text-slate-700">
          Esta é uma <strong>ferramenta de triagem preliminar</strong>. Ela compara os dados informados pelo consumidor e pode apontar divergências que merecem esclarecimento. O resultado <strong>não confirma cobrança ilegal ou abusiva</strong>, não substitui a análise da fatura pela RGE, a avaliação da ANEEL ou a orientação do Procon.
        </p>
      </div>

      <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div className="flex items-start gap-2">
          <span className="font-bold text-amber-800">•</span>
          <p>
            <strong>Percentuais de Referência Homologados:</strong> Os reajustes anuais da RGE são autorizados pela ANEEL por meio de Resoluções Homologatórias específicas (ex: 14,11% residencial para 2025 e ~14,97% para 2026). A existência de reajuste é ato regulamentar previsto em contrato de concessão; o pedido de esclarecimento é cabível quando a variação faturada foge ao padrão histórico ou às medições reais de consumo.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <span className="font-bold text-amber-800">•</span>
          <p>
            <strong>Componentes da Fatura:</strong> Lembre-se de que a conta de luz inclui a Tarifa de Energia (TE), Tarifa de Uso do Sistema de Distribuição (TUSD), tributos federais e estaduais (ICMS, PIS/COFINS), Contribuição de Iluminação Pública (CIP) e eventuais adicionais de Bandeiras Tarifárias (amarela ou vermelha).
          </p>
        </div>

        <div className="flex items-start gap-2">
          <span className="font-bold text-amber-800">•</span>
          <p>
            <strong>Dias de Leitura e Estimativas:</strong> Verifique se a sua conta recente teve ciclo de faturamento atípico (mais de 30 dias) ou se foi precedida de leituras estimadas por média, o que pode acumular faturamento no ciclo seguinte.
          </p>
        </div>
      </div>

      {/* Official Contact Channels Grid */}
      <div className="mt-4 pt-4 border-t border-amber-200/80 bg-white/80 rounded-xl p-4 text-xs sm:text-sm text-slate-800 space-y-3">
        <div className="font-bold text-[#1a3a5f] flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-700" />
          <span>Canais Oficiais para Contato e Reclamações</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
          {/* RGE */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="font-bold text-slate-900">1. Concessionária RGE</div>
            <p className="text-[11px] text-slate-600">Central de Atendimento 24h:</p>
            <p className="font-semibold text-blue-900">0800 970 0900</p>
            <p className="text-[11px] text-slate-500">Site: www.rge-rs.com.br</p>
          </div>

          {/* Procon Taquara */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="font-bold text-slate-900">2. Procon de Taquara / RS</div>
            <p className="text-[11px] text-slate-600">E-mail para envio de documentos:</p>
            <p className="font-semibold text-blue-900 truncate">procon@taquara.rs.gov.br</p>
            <p className="text-[11px] text-slate-500">Taquara / RS</p>
          </div>

          {/* Aneel / Consumidor.gov.br */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="font-bold text-slate-900">3. Consumidor.gov & ANEEL</div>
            <p className="text-[11px] text-slate-600">Plataforma nacional de mediação:</p>
            <p className="font-semibold text-blue-900">consumidor.gov.br</p>
            <p className="text-[11px] text-slate-500">ANEEL: Telefone 167</p>
          </div>
        </div>
      </div>
    </section>
  );
};
