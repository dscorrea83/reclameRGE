import React from 'react';
import { Plus, Trash2, Calculator, RotateCcw, AlertTriangle, FileText, Info } from 'lucide-react';
import { BillEntry } from '../types';
import { formatBRL, formatMonthYear } from '../utils/calculator';

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
    <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
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
        Preencha o <strong>período</strong> (mês/ano), o <strong>valor total em R$</strong> e o <strong>consumo em kWh</strong>. A conta com a data mais recente é automaticamente identificada como a <strong>contestada</strong>; as duas anteriores serão a base de cálculo da média.
      </p>

      {/* Desktop / Tablet Table View */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl mb-4">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-3.5 w-1/4">Período (Mês/Ano)</th>
              <th className="py-3 px-3.5 w-1/4">Valor Total (R$)</th>
              <th className="py-3 px-3.5 w-1/4">Consumo (kWh)</th>
              <th className="py-3 px-3.5 w-1/6 hidden sm:table-cell">Tarifa Calculada</th>
              <th className="py-3 px-2 text-center w-12">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {entries.map((entry, index) => {
              const isContested = entry.id === latestId && validPeriods.length >= 2;
              const isBase = !isContested && Boolean(entry.period) && validPeriods.length >= 2;

              const valNum = typeof entry.valor === 'number' ? entry.valor : parseFloat(String(entry.valor).replace(',', '.'));
              const kwhNum = typeof entry.consumo === 'number' ? entry.consumo : parseFloat(String(entry.consumo).replace(',', '.'));
              const unitRate = !isNaN(valNum) && !isNaN(kwhNum) && kwhNum > 0 ? valNum / kwhNum : null;

              return (
                <tr
                  key={entry.id}
                  className={`transition-colors ${
                    isContested
                      ? 'bg-amber-50/50'
                      : isBase
                      ? 'bg-blue-50/20'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-3.5">
                    <div className="flex flex-col gap-1">
                      <input
                        type="month"
                        value={entry.period}
                        onChange={(e) => onUpdateRow(entry.id, 'period', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                      <div className="flex items-center gap-1">
                        {isContested && (
                          <span className="inline-flex items-center text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                            Conta Contestada
                          </span>
                        )}
                        {isBase && (
                          <span className="inline-flex items-center text-[11px] font-medium text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                            Conta Base (Média)
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

                  <td className="py-2.5 px-3.5">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">
                        R$
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        value={entry.valor}
                        onChange={(e) => onUpdateRow(entry.id, 'valor', e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                  </td>

                  <td className="py-2.5 px-3.5">
                    <div className="relative">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        placeholder="Ex: 220"
                        value={entry.consumo}
                        onChange={(e) => onUpdateRow(entry.id, 'consumo', e.target.value)}
                        className="w-full pr-12 pl-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">
                        kWh
                      </span>
                    </div>
                  </td>

                  <td className="py-2.5 px-3.5 hidden sm:table-cell">
                    {unitRate ? (
                      <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        R$ {formatBRL(unitRate)}/kWh
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">-</span>
                    )}
                  </td>

                  <td className="py-2.5 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveRow(entry.id)}
                      disabled={entries.length <= 1}
                      title="Excluir fatura"
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={onAddRow}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-sm transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4 text-blue-600" />
          <span>Adicionar outra fatura</span>
        </button>

        <button
          type="button"
          onClick={onCalculate}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#2c5f8a] hover:bg-[#1a3a5f] text-white font-bold text-sm sm:text-base transition-colors shadow-sm active:scale-[0.99]"
        >
          <Calculator className="w-4 h-4" />
          <span>Calcular meu caso</span>
        </button>
      </div>
    </section>
  );
};
