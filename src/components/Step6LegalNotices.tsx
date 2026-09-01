import React from 'react';
import { ShieldCheck, Info, HelpCircle, PhoneCall, Building2, MapPin, Mail } from 'lucide-react';

export const Step6LegalNotices: React.FC = () => {
  return (
    <section className="bg-[#fff8f0] rounded-xl border border-[#f0d9b5] p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#c05621] text-white font-bold text-sm">
          5
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-amber-950">
          Ressalvas importantes (leia antes de agir)
        </h2>
      </div>

      <div className="space-y-2.5 text-xs sm:text-sm text-amber-950/90 leading-relaxed">
        <div className="flex items-start gap-2">
          <span className="font-bold text-amber-800">•</span>
          <p>
            <strong>Reajuste homologado pela Aneel:</strong> O índice médio residencial de <strong>14,11%</strong> foi formalmente autorizado pela agência reguladora. Ter um reajuste não é ilegal em si; a contestação cabe quando o valor faturado diverge da métrica ou apresenta saltos desproporcionais sem respaldo de consumo.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <span className="font-bold text-amber-800">•</span>
          <p>
            <strong>Caráter indicativo:</strong> O cálculo desta ferramenta é um instrumento de utilidade pública e cidadania ativa, servindo como estimativa preliminar para fundamentar sua solicitação perante o Procon. Não substitui perícia técnica do medidor.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <span className="font-bold text-amber-800">•</span>
          <p>
            <strong>Consumo em kWh vs. Valor em R$:</strong> A comparação que leva em conta os <strong>kWh</strong> afere o custo unitário da tarifa e é mais precisa. Se você preencheu apenas o valor em reais, aumentos causados por maior uso de ar-condicionado, estufas ou chuveiros elétricos podem impactar o resultado.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <span className="font-bold text-amber-800">•</span>
          <p>
            <strong>Sazonalidade e Bandeiras Tarifárias:</strong> A orientação oficial do Procon de Taquara estabelece a média dos dois meses anteriores imediatos. Lembre-se que mudanças de bandeira (verde, amarela, vermelha) e tributos também impactam a composição tarifária.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <span className="font-bold text-amber-800">•</span>
          <p>
            <strong>Anexos obrigatórios:</strong> Ao encaminhar seu e-mail ao Procon de Taquara (<code>procon@taquara.rs.gov.br</code>), é <strong>indispensável anexar as 3 contas em PDF</strong>.
          </p>
        </div>
      </div>

      {/* Procon Contact Card */}
      <div className="mt-4 pt-4 border-t border-amber-200/80 bg-white/70 rounded-xl p-4 text-xs sm:text-sm text-slate-800 space-y-2">
        <div className="font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#1a3a5f]" />
          <span>Canais de Atendimento do Procon de Taquara / RS</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span>E-mail: <strong>procon@taquara.rs.gov.br</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span>Sede: Rua Júlio de Castilhos, Taquara - RS</span>
          </div>
        </div>
      </div>
    </section>
  );
};
