import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { IntroAlert } from './components/IntroAlert';
import { Step1DownloadGuide } from './components/Step1DownloadGuide';
import { Step2UploadDropzone } from './components/Step2UploadDropzone';
import { Step3BillsTable } from './components/Step3BillsTable';
import { Step4ResultsView } from './components/Step4ResultsView';
import { Step5ComplaintLetter } from './components/Step5ComplaintLetter';
import { Step6LegalNotices } from './components/Step6LegalNotices';
import { Footer } from './components/Footer';
import { BillEntry, CalculationResult, UserComplaintData } from './types';
import { calculateBillComparison } from './utils/calculator';
import { ExtractedBillData } from './utils/pdfParser';

export default function App() {
  const [entries, setEntries] = useState<BillEntry[]>([
    { id: '1', period: '', valor: '', consumo: '' },
    { id: '2', period: '', valor: '', consumo: '' },
    { id: '3', period: '', valor: '', consumo: '' },
  ]);

  const [userData, setUserData] = useState<UserComplaintData>({
    nome: '',
    cpf: '',
    endereco: '',
    telefone: '',
    email: '',
    uc: '',
    observacoes: '',
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [hasTriedCalculate, setHasTriedCalculate] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAddRow = () => {
    const newId = String(Date.now());
    setEntries((prev) => [...prev, { id: newId, period: '', valor: '', consumo: '' }]);
  };

  const handleRemoveRow = (id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      return updated.length > 0 ? updated : [{ id: '1', period: '', valor: '', consumo: '' }];
    });
  };

  const handleUpdateRow = (id: string, field: keyof BillEntry, value: string | number) => {
    setEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleClearAll = () => {
    setEntries([
      { id: '1', period: '', valor: '', consumo: '' },
      { id: '2', period: '', valor: '', consumo: '' },
      { id: '3', period: '', valor: '', consumo: '' },
    ]);
    setResult(null);
    setHasTriedCalculate(false);
  };

  const handleLoadSample = () => {
    const today = new Date();
    const curYear = today.getFullYear();
    const curMonth = today.getMonth() + 1;

    const m3 = `${curYear}-${String(curMonth).padStart(2, '0')}`;
    const prevM2 = curMonth - 1 <= 0 ? `${curYear - 1}-12` : `${curYear}-${String(curMonth - 1).padStart(2, '0')}`;
    const prevM1 = curMonth - 2 <= 0 ? `${curYear - 1}-${String(curMonth - 2 + 12).padStart(2, '0')}` : `${curYear}-${String(curMonth - 2).padStart(2, '0')}`;

    setEntries([
      { id: '1', period: prevM1, valor: 178.5, consumo: 210, fileName: 'fatura_base_1.pdf' },
      { id: '2', period: prevM2, valor: 184.2, consumo: 215, fileName: 'fatura_base_2.pdf' },
      { id: '3', period: m3, valor: 498.7, consumo: 220, fileName: 'fatura_recente_contestada.pdf' },
    ]);

    setUserData((prev) => ({
      ...prev,
      nome: prev.nome || 'Maria da Silva',
      cpf: prev.cpf || '123.456.789-00',
      endereco: prev.endereco || 'Rua Federação, Centro, Taquara/RS',
      telefone: prev.telefone || '(51) 99876-5432',
      email: prev.email || 'maria.silva@exemplo.com.br',
      uc: prev.uc || '1004582910',
    }));

    setHasTriedCalculate(true);
  };

  const handlePdfsLoaded = (extractedList: ExtractedBillData[]) => {
    if (extractedList.length === 0) return;

    // If UC is found in any bill, auto-fill it
    const foundUc = extractedList.find((e) => e.uc)?.uc;
    if (foundUc && !userData.uc) {
      setUserData((prev) => ({ ...prev, uc: foundUc }));
    }

    // Replace or merge into entries
    const newEntries: BillEntry[] = extractedList.map((item, idx) => ({
      id: String(Date.now() + idx),
      period: item.period,
      valor: item.valor,
      consumo: item.consumo,
      fileName: item.fileName,
    }));

    // If we have fewer than 3, pad with blanks
    while (newEntries.length < 3) {
      newEntries.push({
        id: String(Date.now() + newEntries.length + 10),
        period: '',
        valor: '',
        consumo: '',
      });
    }

    setEntries(newEntries);
    setHasTriedCalculate(true);
  };

  const handleCalculate = () => {
    setHasTriedCalculate(true);
    const calculated = calculateBillComparison(entries);
    setResult(calculated);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Re-calculate automatically whenever entries change if user already clicked calculate
  useEffect(() => {
    if (hasTriedCalculate) {
      const calculated = calculateBillComparison(entries);
      setResult(calculated);
    }
  }, [entries, hasTriedCalculate]);

  const handleUpdateUserData = (field: keyof UserComplaintData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Title & Introduction */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a3a5f] tracking-tight">
            Sua conta de luz veio mais cara? Veja como agir
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Calculadora cidadã e gerador de petição de reclamação para o Procon de Taquara / RS.
          </p>
        </div>

        {/* Intro Alert Banner */}
        <IntroAlert />

        {/* Passo 1: Como baixar */}
        <Step1DownloadGuide />

        {/* Passo 2: Upload de PDF ou manual */}
        <Step2UploadDropzone
          onPdfsLoaded={handlePdfsLoaded}
          onLoadSample={handleLoadSample}
        />

        {/* Passo 3: Tabela de conferência */}
        <Step3BillsTable
          entries={entries}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
          onUpdateRow={handleUpdateRow}
          onClearAll={handleClearAll}
          onCalculate={handleCalculate}
        />

        {/* Passo 4: Resultados / Diagnóstico */}
        <div ref={resultsRef}>
          <Step4ResultsView
            result={result}
            hasTriedCalculate={hasTriedCalculate}
          />
        </div>

        {/* Passo 5: Modelo de Reclamação */}
        <Step5ComplaintLetter
          result={result}
          userData={userData}
          onUpdateUserData={handleUpdateUserData}
        />

        {/* Passo 6: Ressalvas legais e orientações */}
        <Step6LegalNotices />
      </main>

      <Footer />
    </div>
  );
}
