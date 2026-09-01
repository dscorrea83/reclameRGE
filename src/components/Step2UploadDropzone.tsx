import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { parsePdfFile, ExtractedBillData } from '../utils/pdfParser';

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
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'warning' | 'info' | 'error';
    text: string;
  } | null>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(
      (f) => f.type.includes('pdf') || f.name.toLowerCase().endsWith('.pdf')
    );

    if (fileArray.length === 0) {
      setStatusMessage({
        type: 'warning',
        text: 'Por favor, selecione arquivos em formato PDF.',
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage({
      type: 'info',
      text: `Analisando ${fileArray.length} arquivo(s) PDF localmente...`,
    });

    const results: ExtractedBillData[] = [];

    for (const file of fileArray) {
      try {
        const extracted = await parsePdfFile(file);
        results.push(extracted);
      } catch (err) {
        console.error('Error reading PDF:', err);
      }
    }

    setIsLoading(false);

    if (results.length > 0) {
      onPdfsLoaded(results);
      const recognized = results.filter((r) => r.valor !== '').length;
      if (recognized === results.length) {
        setStatusMessage({
          type: 'success',
          text: `✅ ${results.length} fatura(s) processada(s) com sucesso! Confira os dados na tabela abaixo.`,
        });
      } else {
        setStatusMessage({
          type: 'warning',
          text: `⚠️ ${results.length} PDF(s) lidos. Alguns dados podem ter ficado em branco na tabela abaixo; por favor, revise e preencha manualmente se necessário.`,
        });
      }
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Não foi possível extrair o texto dos PDFs. Você pode preencher os campos diretamente na tabela do Passo 3.',
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
    <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1a3a5f] text-white font-bold text-sm">
            2
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#1a3a5f]">
            Envie as três contas (ou preencha manualmente)
          </h2>
        </div>

        <button
          type="button"
          onClick={onLoadSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1a3a5f] bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Carregar exemplo com dados reais</span>
        </button>
      </div>

      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
        Você pode anexar os <strong>PDFs das faturas</strong> para extração automática ou digitar diretamente na tabela. Seus arquivos são lidos exclusivamente dentro do seu próprio navegador (nenhum documento é transmitido para a internet).
      </p>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
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

        <div className="flex flex-col items-center justify-center gap-2.5">
          <div className="w-12 h-12 rounded-full bg-blue-100/80 text-[#2c5f8a] flex items-center justify-center shadow-xs">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-sm sm:text-base font-semibold text-slate-800">
              Arraste e solte os PDFs das suas 3 contas aqui
            </p>
            <p className="text-xs text-slate-500 mt-1">
              ou clique para selecionar os arquivos no seu computador / celular
            </p>
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Processamento seguro & local (100% privado)</span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`mt-3 p-3 rounded-lg text-xs sm:text-sm flex items-start gap-2 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : statusMessage.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-blue-50 text-blue-900 border-blue-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </section>
  );
};
