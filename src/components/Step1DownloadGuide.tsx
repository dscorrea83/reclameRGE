import React from 'react';
import { Download, ExternalLink, HelpCircle, FileSpreadsheet } from 'lucide-react';

export const Step1DownloadGuide: React.FC = () => {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1a3a5f] text-white font-bold text-sm">
          1
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-[#1a3a5f]">
          Baixe suas contas no site da RGE
        </h2>
      </div>

      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
        Você vai precisar de <strong>três contas</strong>: a que quer contestar (mês mais recente) e as <strong>duas anteriores</strong> para compor a média de consumo. Para baixá-las em PDF, acesse o portal de serviços da RGE:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
        <a
          href="https://www.rge-rs.com.br/segunda-via-de-conta"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-300 transition-all text-left"
        >
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
              <span>Segunda via de conta RGE</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-600 opacity-80" />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Emissão rápida da fatura mais recente em PDF (necessário login com e-mail/CPF e senha).
            </p>
          </div>
        </a>

        <a
          href="https://www.cpfl.com.br/integrador/servicos/historico-contas"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-3 p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-300 transition-all text-left"
        >
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
              <span>Histórico completo de faturas (CPFL/RGE)</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600 opacity-80" />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Permite baixar as contas completas com detalhamento de consumo em <strong>kWh</strong> e encargos.
            </p>
          </div>
        </a>
      </div>

      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
        <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Dica importante sobre o consumo (kWh):</strong> A fatura completa discrimina a quantidade de <strong>kWh</strong> consumidos. Ao informar o consumo, o cálculo avalia o <em>custo real da tarifa por kWh</em>, evitando falsos diagnósticos decorrentes de uso extraordinário de chuveiro ou ar-condicionado. Se não encontrar o kWh, a calculadora ainda funciona usando o valor em R$.
        </div>
      </div>
    </section>
  );
};
