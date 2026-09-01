import React, { useState } from 'react';
import {
  Copy,
  Download,
  Mail,
  Printer,
  Check,
  User,
  MapPin,
  Phone,
  Hash,
  FileCheck2,
  ExternalLink,
  Edit3,
  Paperclip,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CalculationResult, UserComplaintData } from '../types';
import { generateProconEmail } from '../utils/calculator';

interface Step5ComplaintLetterProps {
  result: CalculationResult | null;
  userData: UserComplaintData;
  onUpdateUserData: (field: keyof UserComplaintData, value: string) => void;
}

export const Step5ComplaintLetter: React.FC<Step5ComplaintLetterProps> = ({
  result,
  userData,
  onUpdateUserData,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPersonalizeForm, setShowPersonalizeForm] = useState(true);
  const [forceShowModel, setForceShowModel] = useState(false);

  if (!result || !result.valid) {
    return (
      <section id="step5-letter-section" className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1a3a5f] text-white font-bold text-sm">
            5
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#1a3a5f]">
            Modelo de solicitação e esclarecimento para o Procon
          </h2>
        </div>
        <p className="text-sm text-slate-500 italic">
          O modelo estruturado de pedido será gerado automaticamente assim que você preencher os dados na tabela e clicar em &quot;Gerar triagem comparativa&quot;.
        </p>
      </section>
    );
  }

  const isEligible = result.isEligibleForComplaint || forceShowModel;
  const emailText = generateProconEmail(result, userData);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(emailText)
      .then(() => {
        setCopied(true);
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
          });
        } catch (e) {
          // ignore
        }
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {
        alert('Não foi possível copiar automaticamente. Por favor, selecione e copie o texto manualmente.');
      });
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([emailText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solicitacao-procon-taquara-rge-${result.contestedBill.period || 'conta'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleMailTo = () => {
    const subject = encodeURIComponent(
      `Solicitação de Análise e Esclarecimento - Fatura RGE (${result.contestedBill.period}) - UC: ${userData.uc || 'Consumidor'}`
    );
    const body = encodeURIComponent(emailText);
    window.location.href = `mailto:procon@taquara.rs.gov.br?subject=${subject}&body=${body}`;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Solicitação Procon Taquara - RGE</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; padding: 40px; color: #111; }
            h1 { font-size: 18px; text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>SOLICITAÇÃO DE ESCLARECIMENTO E INTERVENÇÃO - PROCON TAQUARA / RS</h1>
          <pre>${emailText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  return (
    <section id="step5-letter-section" className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1a3a5f] text-white font-bold text-sm">
            5
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#1a3a5f]">
            Modelo de solicitação e esclarecimento para o Procon
          </h2>
        </div>

        {isEligible && (
          <button
            type="button"
            onClick={() => setShowPersonalizeForm(!showPersonalizeForm)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{showPersonalizeForm ? 'Ocultar campos' : 'Editar meus dados no modelo'}</span>
          </button>
        )}
      </div>

      {!isEligible ? (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm space-y-3">
          <p>
            A variação identificada na triagem está em conformidade com o histórico e os percentuais de referência, de modo que o modelo de petição não foi sugerido por padrão.
          </p>
          <p className="text-xs text-slate-500">
            Se ainda assim você identificar irregularidade em hidrômetro/relógio, cobrança de encargos avulsos ou erro na leitura do medidor, você pode gerar a minuta abaixo:
          </p>
          <button
            type="button"
            onClick={() => setForceShowModel(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1a3a5f] bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors shadow-2xs"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Gerar modelo de solicitação mesmo assim</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Com base na triagem realizada, preparamos uma <strong>solicitação estruturada e fundamentada</strong> para requerer à concessionária a memória de cálculo, histórico de leituras e conferência de faturamento. Preencha seus dados para completar os campos:
          </p>

          {/* Personalization Inputs */}
          {showPersonalizeForm && (
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <User className="w-4 h-4 text-blue-600" />
                <span>Dados do consumidor e da instalação:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo do Titular:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Maria da Silva"
                    value={userData.nome}
                    onChange={(e) => onUpdateUserData('nome', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CPF:
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={userData.cpf}
                    onChange={(e) => onUpdateUserData('cpf', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código de Instalação (UC RGE):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 1002345678"
                    value={userData.uc}
                    onChange={(e) => onUpdateUserData('uc', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefone / WhatsApp:
                  </label>
                  <input
                    type="text"
                    placeholder="(51) 99999-9999"
                    value={userData.telefone}
                    onChange={(e) => onUpdateUserData('telefone', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seu E-mail:
                  </label>
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={userData.email}
                    onChange={(e) => onUpdateUserData('email', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Endereço Completo (Taquara/RS):
                  </label>
                  <input
                    type="text"
                    placeholder="Rua, Número, Bairro, Taquara/RS"
                    value={userData.endereco}
                    onChange={(e) => onUpdateUserData('endereco', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* Prior RGE Protocol information (Item 7 & 8) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Protocolo de atendimento prévio RGE (se houver):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 202619847291"
                    value={userData.protocoloRGE || ''}
                    onChange={(e) => onUpdateUserData('protocoloRGE', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data do protocolo / Resposta da concessionária (se houver):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 10/08/2026 - Concessionária manteve a cobrança sem detalhar cálculo"
                    value={userData.respostaRGE || ''}
                    onChange={(e) => onUpdateUserData('respostaRGE', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observações e relato adicional do consumidor (opcional):
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: No período faturado a residência esteve fechada por 10 dias..."
                  value={userData.observacoes}
                  onChange={(e) => onUpdateUserData('observacoes', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-y"
                />
              </div>
            </div>
          )}

          {/* Email / Petition Box */}
          <div className="relative">
            <div className="flex items-center justify-between bg-slate-800 text-slate-200 px-4 py-2.5 rounded-t-xl text-xs font-medium">
              <span>Destinatário: <strong>procon@taquara.rs.gov.br</strong></span>
              <span>Minuta de Solicitação</span>
            </div>
            <div className="bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm p-4 sm:p-5 rounded-b-xl border border-slate-800 shadow-inner max-h-[380px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
              {emailText}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              id="btn-copy-petition"
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2c5f8a] hover:bg-[#1a3a5f] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.98]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Texto Copiado!' : 'Copiar Texto'}</span>
            </button>

            <button
              id="btn-open-email-client"
              type="button"
              onClick={handleMailTo}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.98]"
            >
              <Mail className="w-4 h-4" />
              <span>Abrir no Aplicativo de E-mail</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Baixar (.txt)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>

          {/* Attachment Guidance (Item 9) */}
          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 space-y-1">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <Paperclip className="w-4 h-4 text-blue-700" />
              <span>Documentos recomendados para anexar à solicitação:</span>
            </div>
            <p className="pl-6 text-slate-700 leading-relaxed">
              Recomenda-se anexar a <strong>fatura contestada</strong> e as <strong>contas anteriores</strong> utilizadas na comparação, além de <strong>fotografias legíveis do medidor de luz</strong> (com o número do relógio e a leitura) e dos <strong>protocolos de atendimento</strong> abertos previamente junto à RGE.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
