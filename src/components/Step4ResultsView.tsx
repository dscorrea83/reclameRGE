import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  TrendingUp,
  Zap,
  Info,
  Scale,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { CalculationResult } from '../types';
import { formatBRL, formatPercent, formatMonthYear, REAJUSTE_OFICIAL } from '../utils/calculator';

interface Step4ResultsViewProps {
  result: CalculationResult | null;
  hasTriedCalculate: boolean;
}

export const Step4ResultsView: React.FC<Step4ResultsViewProps> = ({
  result,
  hasTriedCalculate,
}) => {
  if (!hasTriedCalculate) {
    return null;
  }

  if (!result || !result.valid) {
    return (
      <section className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-900 shadow-sm animate-in fade-in duration-300">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-rose-900">
              Dados insuficientes para a comparação
            </h3>
            <p className="text-sm text-rose-800 leading-relaxed">
              Para efetuar a análise, você precisa preencher o período e o valor de ao menos <strong>duas contas</strong>. O Procon de Taquara recomenda <strong>três faturas</strong> (a conta contestada + as 2 anteriores para cálculo da média).
            </p>
          </div>
        </div>
      </section>
    );
  }

  const isGreen = result.status === 'green';
  const isYellow = result.status === 'yellow';
  const isRed = result.status === 'red';

  const contestedPeriod = formatMonthYear(result.contestedBill.period);
  const maxAllowedValor = result.avgPreviousValor * (1 + REAJUSTE_OFICIAL / 100);

  // Comparison bar visual width percentages
  const maxBarValue = Math.max(result.contestedValor, maxAllowedValor, result.avgPreviousValor) * 1.15;
  const basePct = Math.min(100, Math.max(8, (result.avgPreviousValor / maxBarValue) * 100));
  const allowedPct = Math.min(100, Math.max(8, (maxAllowedValor / maxBarValue) * 100));
  const contestedPct = Math.min(100, Math.max(8, (result.contestedValor / maxBarValue) * 100));

  return (
    <section className="space-y-4 animate-in fade-in duration-300">
      {/* Veredito Banner */}
      <div
        className={`rounded-xl border p-5 sm:p-6 shadow-sm transition-all ${
          isGreen
            ? 'bg-[#e6f4ea] border-[#a3d9b1] text-[#1e7d4f]'
            : isYellow
            ? 'bg-[#fdf6e3] border-[#e6c76a] text-[#b8860b]'
            : 'bg-[#fbe9e7] border-[#ef9a9a] text-[#b3261e]'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-white/70 shadow-xs flex-shrink-0 mt-0.5">
            {isGreen && <CheckCircle2 className="w-7 h-7 text-[#1e7d4f]" />}
            {isYellow && <AlertTriangle className="w-7 h-7 text-[#b8860b]" />}
            {isRed && <Flame className="w-7 h-7 text-[#b3261e]" />}
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap justify-between">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                {result.title}
              </h3>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  isGreen
                    ? 'bg-emerald-200/80 text-emerald-900'
                    : isYellow
                    ? 'bg-amber-200/80 text-amber-900'
                    : 'bg-rose-200/90 text-rose-950'
                }`}
              >
                Variação: {formatPercent(result.percentageIncrease)}
              </span>
            </div>

            <p className="text-sm sm:text-base font-normal leading-relaxed text-slate-800">
              {result.description}
            </p>

            {/* kWh unit rate detail or warning */}
            {result.hasKwh && result.rateContested && result.ratePreviousAvg ? (
              <div className="mt-3 pt-3 border-t border-black/10 text-xs sm:text-sm text-slate-800 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>
                  <strong>Tarifa média anterior:</strong> R$ {formatBRL(result.ratePreviousAvg)}/kWh
                </span>
                <span>→</span>
                <span>
                  <strong>Tarifa na conta contestada:</strong> R$ {formatBRL(result.rateContested)}/kWh
                </span>
                <span className="font-semibold text-blue-900">
                  (Custo da energia aumentou {formatPercent(result.ratePercentageIncrease)})
                </span>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-black/10 text-xs text-slate-700 flex items-start gap-1.5">
                <Info className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Atenção:</strong> Cálculo efetuado com base no valor em R$. Para isolar o impacto do uso de eletrodomésticos, preencha o consumo em <strong>kWh</strong> na tabela.
                </span>
              </div>
            )}

            {result.onlyTwoBills && (
              <div className="mt-2 text-xs text-slate-700 bg-white/50 p-2 rounded border border-black/10">
                ⚠️ Você utilizou apenas 2 faturas. A recomendação expressa do Procon de Taquara é de 3 faturas (a contestada + duas anteriores) para maior confiabilidade amostral.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Numerical Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>MÉDIA ANTERIOR</span>
            <Scale className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800">
            R$ {formatBRL(result.avgPreviousValor)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Base de {result.previousBills.length} fatura(s) anterior(es)
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>CONTA CONTESTADA</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#1a3a5f]">
            R$ {formatBRL(result.contestedValor)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Referência: <strong>{contestedPeriod}</strong>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>TETO COM REAJUSTE ANEEL</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800">
            R$ {formatBRL(maxAllowedValor)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Média anterior + {formatBRL(REAJUSTE_OFICIAL)}% Aneel
          </p>
        </div>

        <div className={`rounded-xl border p-4 shadow-xs ${
          result.estimatedExcessAmount > 0 ? 'bg-rose-50/70 border-rose-200' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>COBRANÇA EXCEDENTE</span>
            <ArrowUpRight className={`w-4 h-4 ${result.estimatedExcessAmount > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <div className={`text-xl sm:text-2xl font-bold ${result.estimatedExcessAmount > 0 ? 'text-rose-700' : 'text-slate-700'}`}>
            R$ {formatBRL(result.estimatedExcessAmount)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {result.estimatedExcessAmount > 0 ? 'Valor estimado acima do teto' : 'Dentro da margem'}
          </p>
        </div>
      </div>

      {/* Visual Comparison Bars */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Comparativo Visual das Faturas (R$)
        </h4>

        <div className="space-y-3.5">
          {/* Média Anterior */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Média das faturas anteriores</span>
              <span className="font-semibold text-slate-800">R$ {formatBRL(result.avgPreviousValor)}</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${basePct}%` }}
              />
            </div>
          </div>

          {/* Teto Aneel */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Valor esperado c/ Reajuste Oficial Aneel (+14,11%)</span>
              <span className="font-semibold text-emerald-700">R$ {formatBRL(maxAllowedValor)}</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${allowedPct}%` }}
              />
            </div>
          </div>

          {/* Fatura Contestada */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Fatura Contestada ({contestedPeriod})</span>
              <span className="font-bold text-rose-700">R$ {formatBRL(result.contestedValor)}</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isGreen ? 'bg-emerald-500' : isYellow ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${contestedPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
