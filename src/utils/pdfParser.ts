import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker safely
try {
  // Use official CDN worker for reliability across all browser/container setups
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
} catch (e) {
  console.warn('PDF.js worker initialization notice:', e);
}

export interface ExtractedBillData {
  fileName: string;
  period: string; // YYYY-MM
  valor: number | '';
  consumo: number | '';
  uc?: string;
  rawTextPreview?: string;
}

export async function parsePdfFile(file: File): Promise<ExtractedBillData> {
  const arrayBuffer = await file.arrayBuffer();
  
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += pageText + '\n';
  }

  return extractDataFromText(fullText, file.name);
}

export function extractDataFromText(text: string, fileName: string = ''): ExtractedBillData {
  // Normalized single-spaced text
  const clean = text.replace(/\s+/g, ' ');

  // 1. Extract Value (R$)
  let valor: number | '' = '';
  const valorPatterns = [
    /(?:TOTAL\s*A\s*PAGAR|VALOR\s*A\s*PAGAR|TOTAL\s*DA\s*NOTA|VALOR\s*TOTAL|A\s*PAGAR)\s*(?:\(R\$\))?[:\s]*R?\$?\s*([\d\.]+(?:,\d{2}))/i,
    /(?:R\$\s*)([\d\.]+(?:,\d{2}))\s*(?:TOTAL|A\s*PAGAR|VALOR)/i,
    /R\$\s*([\d\.]+(?:,\d{2}))/i,
  ];

  for (const pattern of valorPatterns) {
    const match = clean.match(pattern);
    if (match && match[1]) {
      const numStr = match[1].replace(/\./g, '').replace(',', '.');
      const parsed = parseFloat(numStr);
      if (!isNaN(parsed) && parsed > 5 && parsed < 50000) {
        valor = parsed;
        break;
      }
    }
  }

  // 2. Extract Consumption (kWh)
  let consumo: number | '' = '';
  const consumoPatterns = [
    /(?:Consumo\s*Faturado|Consumo\s*Medido|Energia\s*Ativa|kWh\s*Consumido|Consumo\s*no\s*mês|Consumo\s*kWh|Total\s*kWh|kWh)[:\s]*([\d\.]+(?:,\d+)?)/i,
    /([\d\.]+(?:,\d+)?)\s*kWh/i,
    /(?:Consumo)[:\s]*([\d\.]+)/i,
  ];

  for (const pattern of consumoPatterns) {
    const match = clean.match(pattern);
    if (match && match[1]) {
      const numStr = match[1].replace(/\./g, '').replace(',', '.');
      const parsed = parseFloat(numStr);
      if (!isNaN(parsed) && parsed > 0 && parsed < 20000) {
        consumo = parsed;
        break;
      }
    }
  }

  // 3. Extract Period (Month / Year -> YYYY-MM)
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

  // e.g. "MÊS DE REFERÊNCIA 08/2024", "Ref: AGO/2024", "AGOSTO/2024"
  const periodMonthYearRegex = /(?:refer[êe]ncia|compet[êe]ncia|m[êe]s\s*de\s*refer[êe]ncia|ref\.?)[:\s]*([a-zç]+|\d{2})[\/\-\s](\d{4})/i;
  const matchMY = clean.match(periodMonthYearRegex);

  if (matchMY) {
    const monthPart = matchMY[1].toLowerCase();
    const yearPart = matchMY[2];
    if (/^\d{2}$/.test(monthPart)) {
      period = `${yearPart}-${monthPart}`;
    } else if (mesesMap[monthPart]) {
      period = `${yearPart}-${mesesMap[monthPart]}`;
    }
  }

  if (!period) {
    // Try simple MM/YYYY pattern like "08/2024" or "AGO/2024" in text
    const genericMY = /(?:0[1-9]|1[0-2])[\/](202[3-6])/;
    const gMatch = clean.match(genericMY);
    if (gMatch) {
      const parts = gMatch[0].split('/');
      period = `${parts[1]}-${parts[0]}`;
    }
  }

  // Fallback to current date or filename pattern if empty
  if (!period) {
    const fileNameMatch = fileName.match(/(\d{4})[-_](\d{2})/);
    if (fileNameMatch) {
      period = `${fileNameMatch[1]}-${fileNameMatch[2]}`;
    } else {
      const now = new Date();
      period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
  }

  // 4. Extract UC / Código do Cliente (Optional helpful detail for Procon complaint)
  let uc: string | undefined;
  const ucPattern = /(?:código\s*da\s*instalação|unidade\s*consumidora|seu\s*código|nº\s*do\s*cliente|código\s*do\s*cliente)[:\s]*([0-9\/\-\.]+)/i;
  const ucMatch = clean.match(ucPattern);
  if (ucMatch && ucMatch[1]) {
    uc = ucMatch[1].trim();
  }

  return {
    fileName,
    period,
    valor,
    consumo,
    uc,
    rawTextPreview: clean.substring(0, 150),
  };
}
