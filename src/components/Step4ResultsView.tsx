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
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CalculationResult } from '../types';
import { formatBRL, formatPercent, formatMonthYear } from '../utils/calculator';

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
      <section className="bg-slate-50 border border-slate-300 rounded-xl p-5 text-slate-900 shadow-sm animate-in fade-in duration-300">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900">
              Dados insuficientes para a triagem
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Para efetuar a triagem, você precisa preencher o período e o valor de ao menos <strong>duas contas</strong>. Recomenda-se informar <strong>três faturas</strong> (a conta recente + 2 anteriores de referência) e os dados de <strong>consumo em kWh</strong> para maior precisão analítica.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const contestedPeriod = formatMonthYear(result.contestedBill.period);
  const refPct = result.referenciaAplicada.percentualReferencia;

  // Status styling based on badge
  const badgeStyle = {
    verde: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
      badge: 'bg-emerald-200/90 text-emerald-950 border border-emerald-300',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-700" />,
    },
    amarelo: {
      bg: 'bg-amber-50 border-amber-300 text-amber-950',
      badge: 'bg-amber-200/90 text-amber-950 border border-amber-300',
      icon: <AlertTriangle className="w-6 h-6 text-amber-700" />,
    },
    laranja: {
      bg: 'bg-orange-50 border-orange-300 text-orange-950',
      badge: 'bg-orange-200/90 text-orange-950 border border-orange-300',
      icon: <AlertTriangle className="w-6 h-6 text-orange-700" />,
    },
    vermelho: {
      bg: 'bg-rose-50 border-rose-300 text-rose-950',
      badge: 'bg-rose-200/90 text-rose-950 border border-rose-300',
      icon: <Flame className="w-6 h-6 text-rose-700" />,
    },
    cinza: {
      bg: 'bg-slate-50 border-slate-300 text-slate-900',
      badge: 'bg-slate-200 text-slate-800',
      icon: <Info className="w-6 h-6 text-slate-600" />,
    },
  }[result.statusBadge];

  // Visual comparison width calculations
  const maxBarValue = Math.max(result.contestedValor, result.valorEsperadoReferencia, result.avgPreviousValor) * 1.15;
  const basePct = Math.min(100, Math.max(8, (result.avgPreviousValor / maxBarValue) * 100));
  const expectedPct = Math.min(100, Math.max(8, (result.valorEsperadoReferencia / maxBarValue) * 100));
  const contestedPct = Math.min(100, Math.max(8, (result.contestedValor / maxBarValue) * 100));

  return (
    <section id="step4-results-section" className="space-y-4 animate-in fade-in duration-300">
      {/* 1. Header / Classification Card */}
      <div className={`rounded-xl border p-5 sm:p-6 shadow-sm transition-all ${badgeStyle.bg}`}>
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-white/80 shadow-xs flex-shrink-0 mt-0.5">
            {badgeStyle.icon}
          </div>
          <div className="space-y-2.5 flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Resultado da Triagem Preliminar
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeStyle.badge}`}>
                Variação no Valor: {formatPercent(result.variacaoValorTotal)}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              {result.title}
            </h3>

            <p className="text-sm sm:text-base leading-relaxed text-slate-800">
              {result.description}
            </p>

            {/* Variable Explanation */}
            <div className="p-3 bg-white/70 rounded-xl border border-black/10 text-xs sm:text-sm text-slate-800 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-slate-900">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Análise técnica das variáveis:</span>
              </div>
              <p className="pl-5 leading-relaxed text-slate-700">
                {result.explicacaoVariaveis}
              </p>
            </div>

            {/* Recommendation */}
            <div className="pt-1 flex items-start gap-2 text-xs sm:text-sm font-medium text-slate-800">
              <ArrowRight className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Próximo passo recomendado:</strong> {result.recomendacaoProvidencia}
              </span>
            </div>

            {/* Billed days alert */}
            {result.avisoDiasFaturados && (
              <div className="p-2.5 rounded-lg bg-amber-100/70 border border-amber-300 text-xs text-amber-950">
                {result.avisoDiasFaturados}
              </div>
            )}

            {/* Reading type alert */}
            {result.avisoTipoLeitura && (
              <div className="p-2.5 rounded-lg bg-blue-100/70 border border-blue-300 text-xs text-blue-950">
                {result.avisoTipoLeitura}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Three Distinct Analyses Grid (Item 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* A. Variação do Consumo */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>A. VARIAÇÃO DE CONSUMO</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          {result.hasKwh && result.contestedConsumo && result.avgPreviousConsumo ? (
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {formatPercent(result.variacaoConsumoTotal)}
              </div>
              <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                <div>{result.contestedConsumo} kWh vs média de {result.avgPreviousConsumo.toFixed(0)} kWh</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Média diária: {result.consumoDiarioContestado?.toFixed(1)} kWh/dia ({formatPercent(result.variacaoConsumoDiario)})
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-lg font-semibold text-slate-400 italic">
                Não informado
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Preencha o kWh na tabela para calcular a variação do consumo.
              </p>
            </div>
          )}
        </div>

        {/* B. Variação do Valor Total */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>B. VARIAÇÃO DO VALOR TOTAL</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-[#1a3a5f]">
              {formatPercent(result.variacaoValorTotal)}
            </div>
            <div className="text-xs text-slate-600 mt-1 space-y-0.5">
              <div>R$ {formatBRL(result.contestedValor)} vs média de R$ {formatBRL(result.avgPreviousValor)}</div>
              <div className="text-[11px] text-slate-500">
                Diferença nominal: R$ {formatBRL(result.contestedValor - result.avgPreviousValor)}
              </div>
            </div>
          </div>
        </div>

        {/* C. Variação do Custo Médio por kWh */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>C. CUSTO MÉDIO POR KWH</span>
            <Scale className="w-4 h-4 text-indigo-500" />
          </div>
          {result.hasKwh && result.custoMedioKwhContestado && result.custoMedioKwhAnteriorMedio ? (
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {formatPercent(result.variacaoCustoMedioKwh)}
              </div>
              <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                <div>R$ {formatBRL(result.custoMedioKwhContestado)}/kWh vs R$ {formatBRL(result.custoMedioKwhAnteriorMedio)}/kWh</div>
                <div className="text-[11px] text-slate-500">
                  Ref. tarifária: {formatBRL(refPct)}% ({result.referenciaAplicada.resolucao.split('/')[0]})
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-lg font-semibold text-slate-400 italic">
                Requer kWh
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Compara a fatura líquida dividida pelo volume consumido.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Visual Comparison Bars */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Comparativo Visual dos Valores Faturados (R$)</span>
          </h4>
          <span className="text-[11px] text-slate-500">
            Base referencial: {result.referenciaAplicada.descricao}
          </span>
        </div>

        <div className="space-y-3.5">
          {/* Média Anterior */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Média das faturas anteriores de referência ({result.previousBills.length} conta{result.previousBills.length > 1 ? 's' : ''})</span>
              <span className="font-semibold text-slate-800">R$ {formatBRL(result.avgPreviousValor)}</span>
            </div>
            <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${basePct}%` }}
              />
            </div>
          </div>

          {/* Valor de Referência Estimado */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Valor com aplicação do percentual de referência (+{formatBRL(refPct)}%)</span>
              <span className="font-semibold text-emerald-700">R$ {formatBRL(result.valorEsperadoReferencia)}</span>
            </div>
            <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${expectedPct}%` }}
              />
            </div>
          </div>

          {/* Fatura Recente */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Fatura recente ({contestedPeriod})</span>
              <span className="font-bold text-slate-900">R$ {formatBRL(result.contestedValor)}</span>
            </div>
            <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  result.statusBadge === 'verde'
                    ? 'bg-emerald-500'
                    : result.statusBadge === 'amarelo'
                    ? 'bg-amber-500'
                    : result.statusBadge === 'laranja'
                    ? 'bg-orange-500'
                    : 'bg-rose-500'
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
