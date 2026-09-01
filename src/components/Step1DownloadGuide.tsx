import React from 'react';
import { Download, ExternalLink, HelpCircle, FileSpreadsheet, CheckSquare, Camera, MessageSquare } from 'lucide-react';

export const Step1DownloadGuide: React.FC = () => {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1a3a5f] text-white font-bold text-sm">
          1
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-[#1a3a5f]">
          Como obter as faturas e fluxo recomendado de conferência
        </h2>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">
        A ferramenta utiliza as contas anteriores como <strong>referência de comparação</strong> (modo simplificado de 3 contas ou histórico ampliado). Você pode baixar os documentos completos nos canais oficiais da concessionária:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
              Emissão da fatura mais recente em formato PDF completo (DANF3E).
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
              <span>Histórico de faturas (CPFL / RGE)</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600 opacity-80" />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Permite baixar o histórico com detalhamento do consumo faturado em <strong>kWh</strong>.
            </p>
          </div>
        </a>
      </div>

      {/* Recommended 6-step Consumer Flow (Item 7) */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-blue-600" />
          <span>Fluxo prudente de orientação ao consumidor:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-slate-700">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="font-bold text-[#1a3a5f]">1. Conferir a fatura</span>: Examine o consumo medido em kWh e a discriminação de valores.
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="font-bold text-[#1a3a5f]">2. Fotografar o medidor</span>: Registre a leitura atual do relógio e confira se a leitura foi real ou estimada.
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="font-bold text-[#1a3a5f]">3. Avaliar kWh e ciclo</span>: Compare o consumo diário (kWh/dia) considerando os dias faturados.
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="font-bold text-[#1a3a5f]">4. Checar itens extras</span>: Verifique se há bandeira tarifária, tributos ou parcelamento de débitos.
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="font-bold text-[#1a3a5f]">5. Contatar a RGE</span>: Abra protocolo formal e solicite a memória de cálculo e histórico de leituras.
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="font-bold text-[#1a3a5f]">6. Procon / ANEEL</span>: Persistindo a divergência, reúna as contas e acione o Procon ou Consumidor.gov.br.
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
        <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Importância do consumo em kWh:</strong> Informar o consumo em kWh permite calcular o <em>custo médio da fatura por kWh</em>, evitando que o uso sazonal de aparelhos elétricos (como ar-condicionado ou aquecedores) seja interpretado erroneamente como distorção da distribuidora.
        </div>
      </div>
    </section>
  );
};
