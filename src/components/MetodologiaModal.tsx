import React from 'react';
import { X, BookOpen, ShieldCheck, Scale, AlertTriangle, ExternalLink, Calendar } from 'lucide-react';
import {
  BASE_TARIFARIA_DATA_ATUALIZACAO,
  TABELA_REFERENCIAS_TARIFARIAS,
  formatBRL,
} from '../utils/calculator';

interface MetodologiaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetodologiaModal: React.FC<MetodologiaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#1a3a5f] text-white">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base sm:text-lg">
              Metodologia, Bases Tarifárias e Limitações
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* 1. Finalidade e Quem Desenvolveu */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1a3a5f] text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              1. Finalidade e Autoria
            </h4>
            <p>
              Esta ferramenta é uma iniciativa de utilidade pública e cidadania informada desenvolvida pelo blog <strong>Taquara em Foco (Cidadão-Pesquisador Atento)</strong>. Seu objetivo exclusivo é funcionar como um <strong>instrumento de triagem, conferência e organização prévia de documentos</strong> para consumidores que desejam entender variações em suas faturas de energia elétrica e preparar pedidos de esclarecimento fundamentados perante a concessionária (RGE) ou perante o Procon de Taquara / RS.
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 font-medium flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Aviso essencial:</strong> Esta ferramenta não substitui a análise técnica da fatura pela RGE, a avaliação regulatória da ANEEL, nem parecer pericial ou jurídico formal. O resultado é indicativo e não declara cobrança ilegal.
              </span>
            </div>
          </div>

          {/* 2. Dados e Fórmulas Matemáticas */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#1a3a5f] text-base flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" />
              2. Variáveis e Cálculos Realizados
            </h4>
            <p>
              Para evitar distorções entre aumento decorrente de maior consumo e variações nos custos unitários, o sistema calcula três variáveis matemáticas independentes:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-900 uppercase">A. Variação do Consumo</div>
                <div className="text-[11px] font-mono text-slate-600 my-1 bg-white p-1 rounded border">
                  ((Consumo Atual - Consumo Médio) / Consumo Médio) × 100
                </div>
                <p className="text-[11px] text-slate-500">
                  Avalia a variação em kWh (e em kWh/dia considerando a duração do ciclo faturado).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-900 uppercase">B. Variação do Valor Total</div>
                <div className="text-[11px] font-mono text-slate-600 my-1 bg-white p-1 rounded border">
                  ((Valor Atual - Valor Médio) / Valor Médio) × 100
                </div>
                <p className="text-[11px] text-slate-500">
                  Avalia a oscilação percentual do total líquido da conta (em R$).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-900 uppercase">C. Custo Médio por kWh</div>
                <div className="text-[11px] font-mono text-slate-600 my-1 bg-white p-1 rounded border">
                  Valor Total da Fatura (R$) / Consumo (kWh)
                </div>
                <p className="text-[11px] text-slate-500">
                  Média aritmética que engloba tarifa, tributos, bandeiras e iluminação pública.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Tabela Tarifária de Referência */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#1a3a5f] text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              3. Tabela de Referências Tarifárias e Vigência
            </h4>
            <p className="text-xs text-slate-600">
              O sistema compara as contas com base no percentual homologado para a classe residencial correspondente à vigência do período informado:
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-xl text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Vigência</th>
                    <th className="py-2.5 px-3">Classe</th>
                    <th className="py-2.5 px-3">Ref. Residencial</th>
                    <th className="py-2.5 px-3">Resolução ANEEL / Fonte</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {TABELA_REFERENCIAS_TARIFARIAS.map((ref, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium">
                        {ref.vigenciaInicial} {ref.vigenciaFinal ? `a ${ref.vigenciaFinal}` : 'em diante'}
                      </td>
                      <td className="py-2 px-3">{ref.classe} (B1)</td>
                      <td className="py-2 px-3 font-bold text-[#1a3a5f]">
                        {formatBRL(ref.percentualReferencia)}%
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-600">
                        {ref.resolucao}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              * Nota: O efeito médio para a distribuidora inclui alta tensão, indústria e comércio (ex: 16,06% em 2026), enquanto a classe residencial B1 possui índice específico de aproximadamente 14,97%.
            </p>
          </div>

          {/* 4. Limitações e Fatores de Variação */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#1a3a5f] text-base">
              4. Fatores Externos que Podem Impactar a Conta
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li><strong>Bandeiras Tarifárias:</strong> Acionamento de bandeira amarela ou vermelha (Patamar 1 ou 2) acrescenta valor proporcional ao consumo faturado.</li>
              <li><strong>Tributos e Contribuições:</strong> Variação de alíquota de ICMS, PIS/COFINS e Contribuição de Iluminação Pública (CIP municipal).</li>
              <li><strong>Leituras Estimadas:</strong> Quando a distribuidora fatura pela média e posteriormente realiza leitura real, pode ocorrer cobrança acumulada em um único mês.</li>
              <li><strong>Dias de Faturamento:</strong> Ciclos com 33 a 35 dias acumulam mais consumo do que ciclos de 28 dias.</li>
              <li><strong>Encargos e Parcelamentos:</strong> Cobrança de juros, multas por atraso ou parcelamento de débitos anteriores inseridos na mesma fatura.</li>
            </ul>
          </div>

          {/* 5. Governança e Privacidade */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
            <div className="font-semibold text-slate-800 flex items-center justify-between">
              <span>Governança dos Dados e Privacidade:</span>
              <span className="text-[11px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                Base atualizada em: {BASE_TARIFARIA_DATA_ATUALIZACAO}
              </span>
            </div>
            <p>
              O processamento de arquivos e textos ocorre inteiramente no navegador do usuário (client-side). Nenhum dado pessoal (nome, CPF, endereço, número de instalação) ou arquivo de fatura é gravado ou transmitido para servidores externos.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href="https://taquaraemfoco.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#2c5f8a] hover:underline inline-flex items-center gap-1 font-medium"
          >
            <span>Canal de contato / Sugestões no Substack</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1a3a5f] hover:bg-[#2c5f8a] text-white text-xs font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
