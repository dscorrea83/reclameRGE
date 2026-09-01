import { BillEntry, CalculationResult, UserComplaintData } from '../types';

export const REAJUSTE_OFICIAL = 14.11; // % reajuste residencial homologado pela Aneel
export const TOLERANCIA = 3.0; // % margem aceitável

export function formatBRL(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0,00';
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0,00%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function formatMonthYear(periodStr: string): string {
  if (!periodStr) return '';
  const parts = periodStr.split('-');
  if (parts.length === 2) {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const mesIndex = parseInt(parts[1], 10) - 1;
    if (mesIndex >= 0 && mesIndex < 12) {
      return `${meses[mesIndex]}/${parts[0]}`;
    }
    return `${parts[1]}/${parts[0]}`;
  }
  return periodStr;
}

export function calculateBillComparison(entries: BillEntry[]): CalculationResult | null {
  const validEntries = entries.filter((e) => {
    const v = typeof e.valor === 'number' ? e.valor : parseFloat(String(e.valor).replace(',', '.'));
    return e.period && !isNaN(v) && v > 0;
  });

  if (validEntries.length < 2) {
    return null;
  }

  // Sort chronologically ascending
  const sorted = [...validEntries].sort((a, b) => String(a.period).localeCompare(String(b.period)));

  const contested = sorted[sorted.length - 1];
  const contestedValor = typeof contested.valor === 'number' ? contested.valor : parseFloat(String(contested.valor).replace(',', '.'));
  const contestedConsumo = contested.consumo !== '' && contested.consumo !== undefined ? (typeof contested.consumo === 'number' ? contested.consumo : parseFloat(String(contested.consumo).replace(',', '.'))) : undefined;

  const previous = sorted.slice(0, sorted.length - 1).slice(-2); // up to last 2 baseline bills

  const avgPreviousValor = previous.reduce((sum, item) => {
    const v = typeof item.valor === 'number' ? item.valor : parseFloat(String(item.valor).replace(',', '.'));
    return sum + v;
  }, 0) / previous.length;

  // Check if all previous and contested have valid consumption in kWh
  const hasKwh = Boolean(
    contestedConsumo &&
    contestedConsumo > 0 &&
    previous.every((p) => {
      const c = typeof p.consumo === 'number' ? p.consumo : parseFloat(String(p.consumo).replace(',', '.'));
      return !isNaN(c) && c > 0;
    })
  );

  let avgPreviousConsumo: number | undefined;
  let rateContested: number | undefined;
  let ratePreviousAvg: number | undefined;
  let ratePercentageIncrease: number | undefined;

  let percentageIncrease: number;

  if (hasKwh && contestedConsumo) {
    rateContested = contestedValor / contestedConsumo;

    const rates = previous.map((p) => {
      const v = typeof p.valor === 'number' ? p.valor : parseFloat(String(p.valor).replace(',', '.'));
      const c = typeof p.consumo === 'number' ? p.consumo : parseFloat(String(p.consumo).replace(',', '.'));
      return v / c;
    });
    ratePreviousAvg = rates.reduce((a, b) => a + b, 0) / rates.length;
    ratePercentageIncrease = ((rateContested / ratePreviousAvg) - 1) * 100;

    // We can also calculate avgPreviousConsumo
    avgPreviousConsumo = previous.reduce((sum, item) => {
      const c = typeof item.consumo === 'number' ? item.consumo : parseFloat(String(item.consumo).replace(',', '.'));
      return sum + c;
    }, 0) / previous.length;

    // Use tariff rate increase for comparison as it isolates consumption variations
    percentageIncrease = ratePercentageIncrease;
  } else {
    percentageIncrease = ((contestedValor / avgPreviousValor) - 1) * 100;
  }

  const limiteInvestigar = REAJUSTE_OFICIAL + TOLERANCIA; // 17.11%
  const limiteAlto = REAJUSTE_OFICIAL + 15.0; // 29.11%

  let status: 'green' | 'yellow' | 'red';
  let title: string;
  let description: string;
  let isEligibleForComplaint = false;

  if (percentageIncrease <= limiteInvestigar) {
    status = 'green';
    title = 'Seu aumento está dentro do reajuste oficial';
    description = `A variação de ${formatPercent(percentageIncrease)} está compatível com o reajuste residencial oficial de ${formatBRL(REAJUSTE_OFICIAL)}% homologado pela Aneel. Caso suspeite de leitura errada no hidrômetro/relógio medidor, ainda é possível contatar a concessionária.`;
    isEligibleForComplaint = false;
  } else if (percentageIncrease <= limiteAlto) {
    status = 'yellow';
    title = 'Seu aumento está acima do reajuste oficial';
    description = `A variação de ${formatPercent(percentageIncrease)} ultrapassa o teto do reajuste de ${formatBRL(REAJUSTE_OFICIAL)}%. Recomenda-se abrir protocolo de contestação e enviar ao Procon de Taquara.`;
    isEligibleForComplaint = true;
  } else {
    status = 'red';
    title = 'Aumento abusivo ou muito acima do reajuste oficial';
    description = `A variação de ${formatPercent(percentageIncrease)} é muito superior ao reajuste autorizado de ${formatBRL(REAJUSTE_OFICIAL)}%. Forte indício de cobrança indevida ou distorção tarifária. Formalize imediatamente a reclamação no Procon de Taquara.`;
    isEligibleForComplaint = true;
  }

  // Estimated excess amount: difference above what should be expected with fair base + 14.11%
  const expectedValor = avgPreviousValor * (1 + REAJUSTE_OFICIAL / 100);
  const estimatedExcessAmount = Math.max(0, contestedValor - expectedValor);

  return {
    valid: true,
    contestedBill: contested,
    previousBills: previous,
    avgPreviousValor,
    avgPreviousConsumo,
    contestedValor,
    contestedConsumo,
    percentageIncrease,
    rateContested,
    ratePreviousAvg,
    ratePercentageIncrease,
    hasKwh,
    onlyTwoBills: previous.length === 1,
    estimatedExcessAmount,
    status,
    title,
    description,
    isEligibleForComplaint,
  };
}

export function generateProconEmail(result: CalculationResult, user: UserComplaintData): string {
  const nome = user.nome.trim() || '[NOME COMPLETO DO TITULAR]';
  const cpf = user.cpf.trim() || '[000.000.000-00]';
  const endereco = user.endereco.trim() || '[ENDEREÇO COMPLETO COM BAIRRO, Taquara/RS]';
  const telefone = user.telefone.trim() || '[TELEFONE / WHATSAPP]';
  const email = user.email.trim() || '[SEU E-MAIL]';
  const uc = user.uc.trim() || '[Nº DA INSTALAÇÃO / UNIDADE CONSUMIDORA RGE]';

  const contestedPeriod = formatMonthYear(result.contestedBill.period);
  const contestedVal = formatBRL(result.contestedValor);

  const anterioresStr = result.previousBills
    .map((b) => {
      const v = typeof b.valor === 'number' ? b.valor : parseFloat(String(b.valor).replace(',', '.'));
      const c = b.consumo ? ` (${b.consumo} kWh)` : '';
      return `${formatMonthYear(b.period)}: R$ ${formatBRL(v)}${c}`;
    })
    .join(' e ');

  const mediaValor = formatBRL(result.avgPreviousValor);
  const variacaoStr = formatPercent(result.percentageIncrease);
  const valorCobradoAMaior = formatBRL(result.contestedValor - result.avgPreviousValor);
  const valorDiferencaAneel = formatBRL(result.estimatedExcessAmount);

  let analiseTarifaText = '';
  if (result.hasKwh && result.rateContested && result.ratePreviousAvg) {
    analiseTarifaText = `
- Custo unitário médio anterior: R$ ${formatBRL(result.ratePreviousAvg)} / kWh
- Custo unitário na conta contestada: R$ ${formatBRL(result.rateContested)} / kWh
- Aumento do custo por kWh: ${formatPercent(result.ratePercentageIncrease)} (isolando o efeito do consumo em kWh)`;
  }

  const relatoExtra = user.observacoes.trim()
    ? `\n\nInformações adicionais do consumidor:\n${user.observacoes.trim()}\n`
    : '';

  return `Para: procon@taquara.rs.gov.br
Assunto: Reclamação - Cobrança Abusiva e Variação Excessiva na Conta de Energia Elétrica (RGE)

Ao Órgão de Proteção e Defesa do Consumidor - Procon Taquara/RS,

Eu, ${nome}, portador(a) do CPF nº ${cpf}, residente e domiciliado(a) em ${endereco}, venho por meio deste registrar formal RECLAMAÇÃO em face da concessionária de energia elétrica RGE Sul Distribuidora de Energia S.A., pelos motivos de fato e de direito a seguir expostos:

1. DADOS DA UNIDADE CONSUMIDORA:
- Titular: ${nome}
- Código da Instalação / Unidade Consumidora (UC): ${uc}
- Município: Taquara / RS

2. DEMONSTRATIVO DO AUMENTO E CONTAS EM ANEXO:
Com base na orientação pública do Procon de Taquara para apuração da média de consumo e verificação do reajuste homologado pela Aneel (14,11%), apresento o seguinte comparativo:
- Conta Contestada (${contestedPeriod}): R$ ${contestedVal}${result.contestedConsumo ? ` (${result.contestedConsumo} kWh)` : ''}
- Contas de Referência Anterior: ${anterioresStr}
- Média das contas anteriores: R$ ${mediaValor}
- Variação apurada: ${variacaoStr} (muito superior ao índice médio de 14,11% homologado pela Aneel)${analiseTarifaText}
- Diferença nominal em relação à média: R$ ${valorCobradoAMaior}
- Valor estimado cobrado acima do teto oficial Aneel: R$ ${valorDiferencaAneel}${relatoExtra}

3. PEDIDOS:
Diante do exposto e considerando a notificação já em curso expedida pelo Procon de Taquara à referida concessionária, solicito:
a) A imediata revisão da fatura com vencimento no mês de ${contestedPeriod}, suspendendo eventuais cobranças indevidas, encargos moratórios ou corte de fornecimento enquanto tramita a averiguação;
b) O esclarecimento formal e discriminado dos critérios de medição e itens tarifários aplicados pela concessionária RGE;
c) A retificação do valor para o patamar devido ou a devolução em dobro/compensação em faturas futuras dos valores excedentes, conforme o Artigo 42, Parágrafo Único, do Código de Defesa do Consumidor.

Declaro que envio em anexo a este e-mail as cópias em PDF da conta contestada e das duas faturas anteriores que comprovam o histórico informado.

Nestes termos, pede deferimento.

Taquara/RS, ${new Date().toLocaleDateString('pt-BR')}.

Atenciosamente,
${nome}
Telefone / Contato: ${telefone}
E-mail: ${email}`;
}
