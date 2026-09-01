import React from 'react';
import { Plus, Trash2, Calculator, RotateCcw, HelpCircle, Info, Calendar } from 'lucide-react';
import { BillEntry, TipoLeitura } from '../types';
import { formatBRL, parseNumber } from '../utils/calculator';

interface Step3BillsTableProps {
  entries: BillEntry[];
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onUpdateRow: (id: string, field: keyof BillEntry, value: string | number) => void;
  onClearAll: () => void;
  onCalculate: () => void;
}

export const Step3BillsTable: React.FC<Step3BillsTableProps> = ({
  entries,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  onClearAll,
  onCalculate,
}) => {
  // Sort indices for identifying which is contested (the latest period)
  const validPeriods = entries
    .map((e, idx) => ({ id: e.id, period: e.period, idx }))
    .filter((p) => Boolean(p.period))
    .sort((a, b) => String(a.period).localeCompare(String(b.period)));

  const latestId = validPeriods.length > 0 ? validPeriods[validPeriods.length - 1].id : null;

  return (
    <section id="step3-table-section" className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1a3a5f] text-white font-bold text-sm">
            3
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#1a3a5f]">
            Confira e edite os dados das contas
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-md border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
        Preencha o <strong>período</strong> (mês/ano), o <strong>valor total em R$</strong>, o <strong>consumo em kWh</strong> e os <strong>dias do ciclo</strong>. A conta com a data mais recente é automaticamente identificada como a <strong>contestada</strong>; as anteriores serão a base de referência.
      </p>

      {/* Desktop / Tablet Table View */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl mb-3">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-3 w-[24%]">Período (Mês/Ano)</th>
              <th className="py-3 px-3 w-[18%]">Valor Total (R$)</th>
              <th className="py-3 px-3 w-[18%]">Consumo (kWh)</th>
              <th className="py-3 px-2.5 w-[14%] hidden md:table-cell">Dias Ciclo</th>
              <th className="py-3 px-3 w-[20%] hidden sm:table-cell">
                <div className="flex items-center gap-1" title="Média aritmética do valor total dividido pelo kWh">
                  <span>Custo médio por kWh</span>
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-2 text-center w-10">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {entries.map((entry) => {
              const isContested = entry.id === latestId && validPeriods.length >= 2;
              const isBase = !isContested && Boolean(entry.period) && validPeriods.length >= 2;

              const valNum = parseNumber(entry.valor);
              const kwhNum = parseNumber(entry.consumo);
              const diasNum = parseNumber(entry.diasFaturados) || 30;

              const custoMedioPorKwh = valNum > 0 && kwhNum > 0 ? valNum / kwhNum : null;
              const kwhPorDia = kwhNum > 0 && diasNum > 0 ? kwhNum / diasNum : null;

              return (
                <tr
                  key={entry.id}
                  className={`transition-colors ${
                    isContested
                      ? 'bg-amber-50/60'
                      : isBase
                      ? 'bg-blue-50/25'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Period column */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col gap-1">
                      <input
                        type="month"
                        value={entry.period}
                        onChange={(e) => onUpdateRow(entry.id, 'period', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                      <div className="flex items-center gap-1 flex-wrap">
                        {isContested && (
                          <span className="inline-flex items-center text-[10px] font-bold text-amber-900 bg-amber-200/90 px-1.5 py-0.5 rounded">
                            Conta Recente
                          </span>
                        )}
                        {isBase && (
                          <span className="inline-flex items-center text-[10px] font-medium text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                            Conta Referência
                          </span>
                        )}
                        {entry.fileName && (
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]" title={entry.fileName}>
                            📄 {entry.fileName}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Valor column */}
                  <td className="py-2.5 px-3">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">
                        R$
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        value={entry.valor}
                        onChange={(e) => onUpdateRow(entry.id, 'valor', e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                  </td>

                  {/* Consumo column */}
                  <td className="py-2.5 px-3">
                    <div className="relative">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        placeholder="Ex: 220"
                        value={entry.consumo}
                        onChange={(e) => onUpdateRow(entry.id, 'consumo', e.target.value)}
                        className="w-full pr-10 pl-2.5 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] font-medium">
                        kWh
                      </span>
                    </div>
                  </td>

                  {/* Dias Faturados & Leitura */}
                  <td className="py-2.5 px-2.5 hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="relative">
                        <input
                          type="number"
                          min="15"
                          max="45"
                          placeholder="30"
                          value={entry.diasFaturados || ''}
                          onChange={(e) => onUpdateRow(entry.id, 'diasFaturados', e.target.value)}
                          className="w-full pr-8 pl-2 py-1 border border-slate-300 rounded text-xs bg-white"
                        />
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
                          dias
                        </span>
                      </div>
                      {kwhPorDia && (
                        <div className="text-[10px] text-slate-500">
                          ~{kwhPorDia.toFixed(1)} kWh/dia
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Custo Médio por kWh (Item 2) */}
                  <td className="py-2.5 px-3 hidden sm:table-cell">
                    {custoMedioPorKwh ? (
                      <div className="space-y-0.5">
                        <span className="text-xs font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded inline-block">
                          R$ {formatBRL(custoMedioPorKwh)}/kWh
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">-</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-2.5 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveRow(entry.id)}
                      disabled={entries.length <= 1}
                      title="Excluir linha"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Explicit Footnote regarding Custo Médio por kWh (Item 2) */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
        <div className="flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Sobre a coluna "Custo médio da fatura por kWh":</strong> Este valor é uma <em>média matemática</em> obtida pela divisão do valor total da fatura pelo consumo informado. Ele <strong>não corresponde necessariamente à tarifa homologada pela ANEEL</strong>, pois inclui tributos (ICMS/PIS/COFINS), bandeira tarifária, iluminação pública, juros ou outros encargos discriminados.
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
        <button
          id="btn-add-bill-row"
          type="button"
          onClick={onAddRow}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4 text-blue-600" />
          <span>Adicionar outra fatura (histórico ampliado)</span>
        </button>

        <button
          id="btn-calculate"
          type="button"
          onClick={onCalculate}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#2c5f8a] hover:bg-[#1a3a5f] text-white font-bold text-sm sm:text-base transition-colors shadow-sm active:scale-[0.99]"
        >
          <Calculator className="w-4 h-4" />
          <span>Gerar triagem comparativa</span>
        </button>
      </div>
    </section>
  );
};
