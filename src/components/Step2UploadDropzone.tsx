import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  FileCode,
  ChevronDown,
  ChevronUp,
  Shield,
} from 'lucide-react';
import { parsePdfFile, extractDataFromText, ExtractedBillData } from '../utils/pdfParser';

interface Step2UploadDropzoneProps {
  onPdfsLoaded: (extracted: ExtractedBillData[]) => void;
  onLoadSample: () => void;
}

export const Step2UploadDropzone: React.FC<Step2UploadDropzoneProps> = ({
  onPdfsLoaded,
  onLoadSample,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasteHelper, setShowPasteHelper] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'warning' | 'info' | 'error';
    text: string;
    details?: string[];
  } | null>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(
      (f) => f.type.includes('pdf') || f.name.toLowerCase().endsWith('.pdf')
    );

    if (fileArray.length === 0) {
      setStatusMessage({
        type: 'warning',
        text: 'Por favor, selecione arquivos no formato PDF (faturas digitais da RGE).',
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage({
      type: 'info',
      text: `Analisando ${fileArray.length} arquivo(s) PDF localmente no seu navegador...`,
    });

    const results: ExtractedBillData[] = [];
    const detailsList: string[] = [];

    for (const file of fileArray) {
      try {
        const extracted = await parsePdfFile(file);
        results.push(extracted);

        const periodLabel = extracted.period || 'Mês não id.';
        const valorLabel = extracted.valor ? `R$ ${extracted.valor.toFixed(2)}` : 'R$ pendente';
        const kwhLabel = extracted.consumo ? `${extracted.consumo} kWh` : 'kWh pendente';
        const diasLabel = extracted.diasFaturados ? `(${extracted.diasFaturados} dias)` : '';
        detailsList.push(`📄 ${file.name} ➔ ${periodLabel} | ${valorLabel} | ${kwhLabel} ${diasLabel}`);
      } catch (err) {
        console.error('Error reading PDF:', err);
        detailsList.push(`⚠️ ${file.name}: Leitura de texto não concluída. Preencha manualmente na tabela.`);
      }
    }

    setIsLoading(false);

    if (results.length > 0) {
      onPdfsLoaded(results);
      const recognized = results.filter((r) => r.valor !== '').length;
      if (recognized === results.length) {
        setStatusMessage({
          type: 'success',
          text: `✅ ${results.length} fatura(s) processada(s) no navegador! Os dados foram organizados na tabela do Passo 3.`,
          details: detailsList,
        });
      } else {
        setStatusMessage({
          type: 'warning',
          text: `⚠️ ${results.length} PDF(s) analisado(s). Alguns campos podem requerer preenchimento manual na tabela.`,
          details: detailsList,
        });
      }
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Não foi possível extrair automaticamente o texto deste arquivo. Você pode digitar os valores diretamente na tabela do Passo 3.',
      });
    }
  };

  const handleProcessPastedText = () => {
    if (!pastedText.trim()) return;
    const extracted = extractDataFromText(pastedText, 'Texto Colado');
    if (extracted.valor || extracted.consumo || extracted.period) {
      onPdfsLoaded([extracted]);
      setStatusMessage({
        type: 'success',
        text: `✅ Dados extraídos: ${extracted.period || 'Mês'} - R$ ${extracted.valor || '--'} (${extracted.consumo || '--'} kWh)`,
      });
      setPastedText('');
      setShowPasteHelper(false);
    } else {
      setStatusMessage({
        type: 'warning',
        text: 'Não identificamos valores ou datas no texto informado. Por favor, insira os dados na tabela.',
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <section id="step-upload-section" className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1a3a5f] text-white font-bold text-sm">
            2
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#1a3a5f]">
            Anexe as faturas em PDF (ou preencha a tabela)
          </h2>
        </div>

        <button
          id="btn-sample-data"
          type="button"
          onClick={onLoadSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1a3a5f] bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Carregar exemplo com dados reais</span>
        </button>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">
        Você pode anexar os <strong>PDFs das faturas RGE (DANF3E)</strong> para extração automática dos dados, ou preencher diretamente na tabela do Passo 3.
      </p>

      {/* Privacy Notice (Item 10) */}
      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Privacidade e processamento local:</strong> O site foi desenvolvido para realizar o processamento no seu navegador. Nenhum arquivo ou dado é enviado para servidores externos. Evite inserir dados sensíveis desnecessários.
        </div>
      </div>

      {/* Drag & Drop Box */}
      <div
        id="pdf-dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-7 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-blue-600 bg-blue-50/70 scale-[1.005]'
            : 'border-slate-300 hover:border-[#2c5f8a] hover:bg-slate-50/80 bg-slate-50/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-11 h-11 rounded-full bg-blue-100/80 text-[#2c5f8a] flex items-center justify-center shadow-2xs">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Arraste e solte os PDFs das suas faturas aqui
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              ou clique para selecionar os arquivos no seu computador/celular
            </p>
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Processamento 100% no seu navegador</span>
          </div>
        </div>
      </div>

      {/* Status Feedback */}
      {statusMessage && (
        <div
          id="upload-status-alert"
          className={`p-3.5 rounded-lg text-xs sm:text-sm border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : statusMessage.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-blue-50 text-blue-900 border-blue-200'
          }`}
        >
          <div className="flex items-start gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <span className="font-medium">{statusMessage.text}</span>
          </div>

          {statusMessage.details && statusMessage.details.length > 0 && (
            <ul className="mt-2 pl-6 list-disc space-y-1 text-xs opacity-90">
              {statusMessage.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Text Paste Accordion */}
      <div className="text-right">
        <button
          type="button"
          onClick={() => setShowPasteHelper(!showPasteHelper)}
          className="text-xs text-[#2c5f8a] hover:text-[#1a3a5f] inline-flex items-center gap-1 font-medium underline underline-offset-2"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Opção alternativa: Colar texto copiado da fatura</span>
          {showPasteHelper ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showPasteHelper && (
          <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-left">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cole aqui o texto copiado da fatura ou do app da RGE:
            </label>
            <textarea
              rows={3}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Ex: Ref JUL/2026 ... R$ 504,32 ... Consumo 453 kWh ..."
              className="w-full text-xs p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleProcessPastedText}
                className="px-3 py-1.5 bg-[#1a3a5f] hover:bg-[#2c5f8a] text-white text-xs font-semibold rounded-md transition-colors"
              >
                Extrair dados do texto
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
