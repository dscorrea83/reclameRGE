import * as pdfjsLib from 'pdfjs-dist';
// Import worker through Vite URL resolution
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
  } catch (e) {
    console.warn('PDF.js worker setup fallback:', e);
  }
}

export interface ExtractedBillData {
  fileName: string;
  period: string; // YYYY-MM
  valor: number | '';
  consumo: number | '';
  uc?: string;
  nomeCliente?: string;
  endereco?: string;
  cpf?: string;
  rawTextPreview?: string;
}

export async function parsePdfFile(file: File): Promise<ExtractedBillData> {
  const arrayBuffer = await file.arrayBuffer();
  let fullText = '';

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n';
    }
  } catch (pdfErr) {
    console.warn('Standard PDF.js worker parsing had an issue, attempting stream fallback:', pdfErr);
    
    // Fallback: Read raw ASCII text strings from PDF stream
    try {
      const uint8 = new Uint8Array(arrayBuffer);
      const textDecoder = new TextDecoder('latin1');
      const rawString = textDecoder.decode(uint8);
      
      // Extract text inside parentheses in PDF streams e.g. (JUL/2026) (504,32)
      const textMatches = rawString.match(/\(([^()]{1,100})\)/g);
      if (textMatches && textMatches.length > 5) {
        fullText = textMatches.map((m) => m.slice(1, -1)).join(' ');
      } else {
        fullText = rawString;
      }
    } catch (fallbackErr) {
      console.error('Fallback string extractor also failed:', fallbackErr);
      throw pdfErr;
    }
  }

  return extractDataFromText(fullText, file.name);
}

export function extractDataFromText(text: string, fileName: string = ''): ExtractedBillData {
  if (!text || text.trim().length === 0) {
    return {
      fileName,
      period: '',
      valor: '',
      consumo: '',
    };
  }

  // Normalized single-spaced text
  const clean = text.replace(/\s+/g, ' ');

  // 1. Extract Period (Month / Year -> YYYY-MM)
  let period = '';
  const mesesMap: Record<string, string> = {
    janeiro: '01', jan: '01',
    fevereiro: '02', fev: '02',
    março: '03', marco: '03', mar: '03',
    abril: '04', abr: '04',
    maio: '05', mai: '05',
    junho: '06', jun: '06',
    julho: '07', jul: '07',
    agosto: '08', ago: '08',
    setembro: '09', set: '09',
    outubro: '10', out: '10',
    novembro: '11', nov: '11',
    dezembro: '12', dez: '12',
  };

  // Specific RGE/CPFL pattern: "Ref: mês/ano ... JUL/2026" or "Ref: JUL/2026" or "JUL/2026"
  const rgeRefPattern = /(?:Ref:?\s*m[êe]s\/ano|Ref\.?|M[êe]s\/Ano|Refer[êe]ncia|Compet[êe]ncia)[:\s]*([A-Za-zçÇ]{3,9}|\d{2})[\/\-](\d{4}|\d{2})/i;
  const matchRgeRef = clean.match(rgeRefPattern);

  if (matchRgeRef) {
    const monthRaw = matchRgeRef[1].toLowerCase();
    let yearRaw = matchRgeRef[2];
    if (yearRaw.length === 2) {
      yearRaw = '20' + yearRaw;
    }
    const monthNum = /^\d{2}$/.test(monthRaw) ? monthRaw : mesesMap[monthRaw];
    if (monthNum && parseInt(yearRaw, 10) >= 2020 && parseInt(yearRaw, 10) <= 2035) {
      period = `${yearRaw}-${monthNum}`;
    }
  }

  // Standalone month name / abbrev (e.g. JUL/2026, AGO/2026, JUN/26)
  if (!period) {
    const standaloneMonthPattern = /\b(JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)[\/\-](202[3-9]|2[3-9])\b/i;
    const matchStandalone = clean.match(standaloneMonthPattern);
    if (matchStandalone) {
      const monthCode = matchStandalone[1].toLowerCase();
      let yearVal = matchStandalone[2];
      if (yearVal.length === 2) {
        yearVal = '20' + yearVal;
      }
      const monthNum = mesesMap[monthCode];
      if (monthNum) {
        period = `${yearVal}-${monthNum}`;
      }
    }
  }

  // Numeric MM/YYYY pattern (e.g. 07/2026)
  if (!period) {
    const numericMY = /\b(0[1-9]|1[0-2])[\/](202[3-9])\b/;
    const numMatch = clean.match(numericMY);
    if (numMatch) {
      period = `${numMatch[2]}-${numMatch[1]}`;
    }
  }

  // Fallback to filename if text has no date
  if (!period) {
    const fileNameMatch = fileName.match(/(\d{4})[-_](\d{2})/);
    if (fileNameMatch) {
      period = `${fileNameMatch[1]}-${fileNameMatch[2]}`;
    }
  }

  // 2. Extract Value (R$)
  let valor: number | '' = '';
  const valorPatterns = [
    // RGE specific: "Total a pagar R$ 504,32" or "JUL/2026 24/08/2026 R$ 504,32"
    /(?:TOTAL\s*A\s*PAGAR|VALOR\s*A\s*PAGAR|TOTAL\s*DA\s*NOTA|VALOR\s*TOTAL|TOTAL\s*DISTRIBUIDORA)\s*(?:\(R\$\))?[:\s]*R?\$?\s*([\d\.]+(?:,\d{2}))/i,
    /(?:JUL|JUN|MAI|ABR|MAR|FEV|JAN|DEZ|NOV|OUT|SET|AGO)\/\d{2,4}\s+\d{2}\/\d{2}\/\d{4}\s+R\$\s*([\d\.]+(?:,\d{2}))/i,
    /Total\s+a\s+Pagar\s*\(R\$\)[\s\S]{0,50}?([\d\.]+(?:,\d{2}))/i,
    /R\$\s*([\d\.]+(?:,\d{2}))/i,
  ];

  for (const pattern of valorPatterns) {
    const match = clean.match(pattern);
    if (match && match[1]) {
      const numStr = match[1].replace(/\./g, '').replace(',', '.');
      const parsed = parseFloat(numStr);
      if (!isNaN(parsed) && parsed > 5 && parsed < 100000) {
        valor = parsed;
        break;
      }
    }
  }

  // 3. Extract Consumption (kWh)
  let consumo: number | '' = '';
  const consumoPatterns = [
    // RGE exact: "Consumo Uso Sistema [KWh]-TUSD JUL/26 kWh 453,0000" or "Consumo - TE JUL/26 kWh 453,0000"
    /Consumo\s+(?:Uso\s+Sistema\s*\[KWh\]-TUSD|TE)\s+[A-Z]{3}\/\d{2}\s+kWh\s+([\d\.]+(?:,\d+)?)/i,
    // RGE Medidor table: "Energia Ativa-kWh único \d+ \d+ [\d\.,]+ (\d+)"
    /Energia\s+Ativa-kWh\s+único\s+\d+\s+\d+\s+[\d\.,]+\s+(\d+)/i,
    // History histogram: "JUL 26 llllllllll 453"
    /[A-Z]{3}\s+\d{2}\s+[lI|]+\s+(\d{2,5})\s+\d{1,2}/i,
    // Standard patterns
    /(?:Consumo\s*Faturado|Consumo\s*Medido|Energia\s*Ativa|kWh\s*Consumido|Consumo\s*no\s*mês|Consumo\s*kWh|Total\s*kWh)[:\s]*([\d\.]+(?:,\d+)?)/i,
    /([\d\.]+(?:,\d+)?)\s*kWh/i,
  ];

  for (const pattern of consumoPatterns) {
    const match = clean.match(pattern);
    if (match && match[1]) {
      const numStr = match[1].replace(/\./g, '').replace(',', '.');
      const parsed = parseFloat(numStr);
      if (!isNaN(parsed) && parsed > 0 && parsed < 50000) {
        consumo = Math.round(parsed);
        break;
      }
    }
  }

  // 4. Extract UC / Número da Instalação
  let uc: string | undefined;
  const ucPatterns = [
    /(?:N[úu]mero\s*da\s*UC|Nº\s*da\s*UC|C[óo]digo\s*da\s*Instala[çc][ãa]o|Unidade\s*Consumidora|Seu\s*C[óo]digo)[:\s]*([0-9\.\-\/]{8,20})/i,
    /\b(\d{3}\.\d{3}\.\d{3}-\d{2})\b/, // e.g. 159.600.001-62
  ];

  for (const p of ucPatterns) {
    const ucMatch = clean.match(p);
    if (ucMatch && ucMatch[1]) {
      uc = ucMatch[1].trim();
      break;
    }
  }

  // 5. Extract Client Name & Address
  let nomeCliente: string | undefined;
  let endereco: string | undefined;
  let cpf: string | undefined;

  const cpfMatch = clean.match(/CPF:\s*([\*\d\.\-]+)/i);
  if (cpfMatch && cpfMatch[1]) {
    cpf = cpfMatch[1].trim();
  }

  const rgeClientMatch = clean.match(/([A-Z\s]{5,40})\s+(R\s+[A-Z\s\d,]+(?:JD|BAIRRO|CENTRO|TAQUARA|RS)[\s\S]{0,60}?95600-\d{3}\s+TAQUARA\s+RS)/);
  if (rgeClientMatch) {
    const rawName = rgeClientMatch[1].trim();
    if (!rawName.includes('RGE') && !rawName.includes('DANF3E') && !rawName.includes('DISTRIBUIDORA')) {
      nomeCliente = rawName;
      endereco = rgeClientMatch[2].replace(/\s+/g, ' ').trim();
    }
  }

  return {
    fileName,
    period,
    valor,
    consumo,
    uc,
    nomeCliente,
    endereco,
    cpf,
    rawTextPreview: clean.substring(0, 200),
  };
}
