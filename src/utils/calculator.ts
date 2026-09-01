import {
  BillEntry,
  CalculationResult,
  DiagnosticCategory,
  ReferenciaTarifaria,
  UserComplaintData,
} from '../types';

export const BASE_TARIFARIA_DATA_ATUALIZACAO = 'Agosto/2026';

export const TABELA_REFERENCIAS_TARIFARIAS: ReferenciaTarifaria[] = [
  {
    distribuidora: 'RGE Sul Distribuidora de Energia S.A.',
    classe: 'residencial',
    grupo: 'B1',
    vigenciaInicial: '2024-06-19',
    vigenciaFinal: '2025-06-18',
    percentualReferencia: 14.11,
    resolucao: 'Resolução Homologatória ANEEL nº 3.344/2024',
    fonte: 'https://www.rge-rs.com.br/reajuste',
    descricao: 'Reajuste tarifário anual RGE Sul 2024/2025',
  },
  {
    distribuidora: 'RGE Sul Distribuidora de Energia S.A.',
    classe: 'residencial',
    grupo: 'B1',
    vigenciaInicial: '2025-06-19',
    vigenciaFinal: '2026-06-18',
    percentualReferencia: 14.11,
    resolucao: 'Resolução Homologatória ANEEL nº 3.473/2025',
    fonte: 'https://www.rge-rs.com.br/reajuste',
    descricao: 'Reajuste tarifário residencial RGE 2025 (vigência a partir de 19/06/2025)',
  },
  {
    distribuidora: 'RGE Sul Distribuidora de Energia S.A.',
    classe: 'residencial',
    grupo: 'B1',
    vigenciaInicial: '2026-06-19',
    vigenciaFinal: null,
    percentualReferencia: 14.97,
    resolucao: 'Resolução Homologatória ANEEL nº 3.590/2026',
    fonte: 'https://atosoficiais.com.br/aneel/resolucao-homologatoria-n-3590-2026-homologa-o-resultado-do-reajuste-tarifario-anual-de-2026-as-tarifas-de-energia-te-e-as-tarifas-de-uso-do-sistema-de-distribuicao-tusd-referentes-a-rge-sul-distribuidora-de-energia-sa-rge-e-da-outras-providencias',
    descricao: 'Reajuste tarifário residencial RGE 2026 (~14,97% residencial / 16,06% efeito médio distribuidora)',
  },
];

export function obterReferenciaTarifaria(periodStr: string): ReferenciaTarifaria {
  if (!periodStr) {
    return TABELA_REFERENCIAS_TARIFARIAS[TABELA_REFERENCIAS_TARIFARIAS.length - 1];
  }

  // periodStr is YYYY-MM (e.g. 2025-07 or 2026-07)
  const [yearStr, monthStr] = periodStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  // Compare date threshold (19th of June each year)
  const isAfterJune19th = month > 6 || (month === 6 && true);

  if (year >= 2026 && isAfterJune19th) {
    return TABELA_REFERENCIAS_TARIFARIAS[2]; // 2026 (14.97% Res. 3.590/2026)
  }

  if (year === 2025 && isAfterJune19th) {
    return TABELA_REFERENCIAS_TARIFARIAS[1]; // 2025 (14.11% Res. 3.473/2025)
  }

  if (year <= 2025 && !isAfterJune19th) {
    return TABELA_REFERENCIAS_TARIFARIAS[0];
  }

  return TABELA_REFERENCIAS_TARIFARIAS[TABELA_REFERENCIAS_TARIFARIAS.length - 1];
}

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

export function parseNumber(val: number | string | undefined | null): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (val === undefined || val === null) return 0;

  let s = String(val).trim();
  if (!s) return 0;

  // Remove currency prefixes/symbols and spaces
  s = s.replace(/[R$\s]/g, '');

  if (s.includes(',')) {
    // Brazilian format: "1.234,56" or "467,37" or "231,56"
    s = s.replace(/\./g, '').replace(',', '.');
  } else {
    // Standard JS / HTML input format: "467.37" or "1234.56" or multiple thousand dots "1.234.567"
    const dotCount = (s.match(/\./g) || []).length;
    if (dotCount > 1) {
      s = s.replace(/\./g, '');
    }
  }

  const parsed = parseFloat(s);
  return isNaN(parsed) ? 0 : parsed;
}

export function calculateBillComparison(entries: BillEntry[]): CalculationResult | null {
  const validEntries = entries.filter((e) => {
    const v = parseNumber(e.valor);
    return e.period && !isNaN(v) && v > 0;
  });

  if (validEntries.length < 2) {
    return null;
  }

  // Sort chronologically ascending (oldest to newest)
  const sorted = [...validEntries].sort((a, b) => String(a.period).localeCompare(String(b.period)));

  const contested = sorted[sorted.length - 1];
  const previous = sorted.slice(0, sorted.length - 1);

  const contestedValor = parseNumber(contested.valor);
  const contestedConsumoRaw = parseNumber(contested.consumo);
  const contestedConsumo = contestedConsumoRaw > 0 ? contestedConsumoRaw : undefined;

  const contestedDias = parseNumber(contested.diasFaturados) || 30;

  // Previous bills metrics
  const avgPreviousValor =
    previous.reduce((sum, item) => sum + parseNumber(item.valor), 0) / previous.length;

  const previousDiasArray = previous.map((p) => parseNumber(p.diasFaturados) || 30);
  const diasFaturadosAnteriorMedio =
    previousDiasArray.reduce((a, b) => a + b, 0) / previousDiasArray.length;

  // Check if consumption (kWh) is available for all bills
  const hasKwh = Boolean(
    contestedConsumo &&
    contestedConsumo > 0 &&
    previous.every((p) => parseNumber(p.consumo) > 0)
  );

  let avgPreviousConsumo: number | undefined;
  let variacaoConsumoTotal: number | undefined;
  let consumoDiarioContestado: number | undefined;
  let consumoDiarioAnteriorMedio: number | undefined;
  let variacaoConsumoDiario: number | undefined;

  let custoMedioKwhContestado: number | undefined;
  let custoMedioKwhAnteriorMedio: number | undefined;
  let variacaoCustoMedioKwh: number | undefined;

  // 1. Variação do Valor Total (B)
  const variacaoValorTotal = ((contestedValor - avgPreviousValor) / avgPreviousValor) * 100;

  if (hasKwh && contestedConsumo) {
    const previousConsumoList = previous.map((p) => parseNumber(p.consumo));
    avgPreviousConsumo =
      previousConsumoList.reduce((a, b) => a + b, 0) / previousConsumoList.length;

    // 2. Variação do Consumo Total (A)
    variacaoConsumoTotal =
      ((contestedConsumo - avgPreviousConsumo) / avgPreviousConsumo) * 100;

    // 3. Consumo Médio Diário e Variação
    consumoDiarioContestado = contestedConsumo / contestedDias;
    const previousDailyList = previous.map(
      (p) => parseNumber(p.consumo) / (parseNumber(p.diasFaturados) || 30)
    );
    consumoDiarioAnteriorMedio =
      previousDailyList.reduce((a, b) => a + b, 0) / previousDailyList.length;

    variacaoConsumoDiario =
      ((consumoDiarioContestado - consumoDiarioAnteriorMedio) / consumoDiarioAnteriorMedio) * 100;

    // 4. Variação do Custo Médio por kWh (C)
    custoMedioKwhContestado = contestedValor / contestedConsumo;
    const previousUnitCosts = previous.map(
      (p) => parseNumber(p.valor) / parseNumber(p.consumo)
    );
    custoMedioKwhAnteriorMedio =
      previousUnitCosts.reduce((a, b) => a + b, 0) / previousUnitCosts.length;

    variacaoCustoMedioKwh =
      ((custoMedioKwhContestado - custoMedioKwhAnteriorMedio) / custoMedioKwhAnteriorMedio) * 100;
  }

  // Tariff reference lookup
  const referenciaAplicada = obterReferenciaTarifaria(contested.period);
  const refPct = referenciaAplicada.percentualReferencia;
  const valorEsperadoReferencia = avgPreviousValor * (1 + refPct / 100);
  const estimatedExcessAmount = Math.max(0, contestedValor - valorEsperadoReferencia);

  // Alerts regarding billed days and reading types
  let avisoDiasFaturados: string | undefined;
  if (Math.abs(contestedDias - diasFaturadosAnteriorMedio) >= 4) {
    avisoDiasFaturados = `Aviso sobre ciclo de leitura: A fatura recente possui ${contestedDias} dias faturados, enquanto a média anterior foi de ${diasFaturadosAnteriorMedio.toFixed(0)} dias. A comparação pelo consumo diário em kWh/dia compensa essa diferença no ciclo.`;
  }

  let avisoTipoLeitura: string | undefined;
  const hasEstimatedReading = [contested, ...previous].some((b) => b.tipoLeitura === 'estimada');
  if (hasEstimatedReading) {
    avisoTipoLeitura = 'Identificamos fatura(s) com leitura estimada (pela média). Leituras estimadas seguidas de leitura real podem acumular consumo residual e gerar salto pontual no valor.';
  }

  // Diagnostic Classification (5 categories)
  let diagnosticCategory: DiagnosticCategory;
  let statusBadge: 'verde' | 'amarelo' | 'laranja' | 'vermelho' | 'cinza';
  let title: string;
  let description: string;
  let explicacaoVariaveis: string;
  let recomendacaoProvidencia: string;
  let isEligibleForComplaint = false;

  const TOLERANCIA_REF = 3.5; // Margem de tolerância percentual sobre a referência
  const limiteReferencia = refPct + TOLERANCIA_REF;

  if (!hasKwh) {
    // Sem kWh: análise restrita a valor monetário
    if (variacaoValorTotal <= limiteReferencia) {
      diagnosticCategory = 'aumento_consumo';
      statusBadge = 'verde';
      title = 'Variação compatível com percentuais de referência';
      description = `A variação de ${formatPercent(variacaoValorTotal)} no valor total está próxima do percentual de referência divulgado (${formatBRL(refPct)}%).`;
      explicacaoVariaveis = 'Como os dados de consumo em kWh não foram informados, a triagem avaliou apenas o valor monetário.';
      recomendacaoProvidencia = 'Conferir o detalhamento das faturas e fotografar o medidor em caso de dúvidas operacionais.';
      isEligibleForComplaint = false;
    } else {
      diagnosticCategory = 'componentes_adicionais';
      statusBadge = 'amarelo';
      title = 'Aumento identificado no valor monetário';
      description = `O valor total aumentou ${formatPercent(variacaoValorTotal)}. Como não há registro de kWh nesta triagem, não é possível distinguir se o aumento decorreu de maior consumo, tributos, bandeira ou encargos.`;
      explicacaoVariaveis = 'Recomenda-se informar o consumo em kWh para isolar o custo médio da energia.';
      recomendacaoProvidencia = 'Solicitar à RGE a memória de cálculo e detalhamento de encargos da fatura contestada.';
      isEligibleForComplaint = true;
    }
  } else {
    // Com kWh disponível: análise completa das 3 variáveis
    const varConsumo = variacaoConsumoDiario !== undefined ? variacaoConsumoDiario : (variacaoConsumoTotal || 0);
    const varCustoUnitario = variacaoCustoMedioKwh || 0;

    // Caso A: Aumento decorre principalmente do consumo
    if (varConsumo > 15 && varCustoUnitario <= limiteReferencia) {
      diagnosticCategory = 'aumento_consumo';
      statusBadge = 'verde';
      title = 'Aumento explicado predominantemente pelo consumo em kWh';
      description = `O valor total da fatura variou ${formatPercent(variacaoValorTotal)}, acompanhando o aumento de ${formatPercent(variacaoConsumoTotal)} no consumo informado (${contestedConsumo} kWh vs média anterior de ${avgPreviousConsumo?.toFixed(0)} kWh).`;
      explicacaoVariaveis = `O custo médio por kWh variou ${formatPercent(varCustoUnitario)}, mantendo-se alinhado à referência de ${formatBRL(refPct)}%. Não foi identificada, nesta triagem, divergência tarifária evidente.`;
      recomendacaoProvidencia = 'Verifique o uso de aparelhos elétricos de alto consumo no período (ex: climatizadores, aquecedores, chuveiros).';
      isEligibleForComplaint = false;
    }
    // Caso B: Consumo estável, mas custo médio da fatura subiu moderadamente (bandeiras / tributos / CIP / etc)
    else if (Math.abs(varConsumo) <= 15 && varCustoUnitario > limiteReferencia && varCustoUnitario <= refPct + 20) {
      diagnosticCategory = 'componentes_adicionais';
      statusBadge = 'amarelo';
      title = 'Presença provável de componentes e encargos adicionais';
      description = `O valor total da fatura variou ${formatPercent(variacaoValorTotal)} com consumo estável (${formatPercent(variacaoConsumoTotal)}). O custo médio por kWh subiu ${formatPercent(varCustoUnitario)}.`;
      explicacaoVariaveis = `A diferença restante (${formatPercent(varCustoUnitario - refPct)} acima da referência) não permite concluir, isoladamente, que houve cobrança indevida. Essa oscilação pode estar relacionada a bandeira tarifária, tributos (ICMS/PIS/COFINS), iluminação pública, juros ou parcelamentos.`;
      recomendacaoProvidencia = 'Conferir os itens discriminados na fatura (bandeira, CIP e tributos) e solicitar esclarecimento à RGE caso algum item seja desconhecido.';
      isEligibleForComplaint = true;
    }
    // Caso C: Divergência aparente substancial
    else if (varCustoUnitario > refPct + 20 && varCustoUnitario <= 60) {
      diagnosticCategory = 'divergencia_aparente';
      statusBadge = 'laranja';
      title = 'Divergência aparente que requer esclarecimento formal';
      description = `O valor faturado aumentou ${formatPercent(variacaoValorTotal)}, com salto de ${formatPercent(varCustoUnitario)} no custo médio por kWh, desproporcional à variação de consumo (${formatPercent(variacaoConsumoTotal)}).`;
      explicacaoVariaveis = 'Há uma diferença relevante entre o histórico de faturamento, a média diária e os valores cobrados, recomendando-se pedido formal de esclarecimento à concessionária.';
      recomendacaoProvidencia = 'Solicitar à RGE a revisão das leituras e a memória de cálculo. Persistindo a dúvida, buscar orientação no Procon de Taquara.';
      isEligibleForComplaint = true;
    }
    // Caso D: Variação extrema ou discrepância elevada
    else if (varCustoUnitario > 60 || (variacaoValorTotal > 80 && varConsumo < 20)) {
      diagnosticCategory = 'encaminhamento_procon';
      statusBadge = 'vermelho';
      title = 'Variação atípica com forte recomendação de apuração';
      description = `Foi identificada variação acentuada de ${formatPercent(variacaoValorTotal)} no valor da conta e de ${formatPercent(varCustoUnitario)} no custo médio por kWh.`;
      explicacaoVariaveis = 'A discrepância observada entre o histórico e a fatura recente demanda verificação minuciosa do medidor, dos códigos de leitura e do faturamento.';
      recomendacaoProvidencia = 'Abrir protocolo de contestação prioritário junto à RGE e, simultaneamente, reunir as contas e fotografias do relógio para formalização no Procon de Taquara.';
      isEligibleForComplaint = true;
    }
    // Caso E: Valores dentro dos parâmetros de referência
    else {
      diagnosticCategory = 'aumento_consumo';
      statusBadge = 'verde';
      title = 'Variação dentro dos parâmetros de referência';
      description = `A variação apurada de ${formatPercent(variacaoValorTotal)} está em conformidade com o histórico e com o percentual de referência (${formatBRL(refPct)}%).`;
      explicacaoVariaveis = `Custo médio por kWh variou ${formatPercent(varCustoUnitario)}, compatível com a vigência tarifária.`;
      recomendacaoProvidencia = 'Nenhuma providência adicional necessária nesta triagem.';
      isEligibleForComplaint = false;
    }
  }

  return {
    valid: true,
    diagnosticCategory,
    contestedBill: contested,
    previousBills: previous,
    avgPreviousValor,
    contestedValor,
    variacaoValorTotal,

    avgPreviousConsumo,
    contestedConsumo,
    variacaoConsumoTotal,
    hasKwh,

    diasFaturadosContestado: contestedDias,
    diasFaturadosAnteriorMedio,
    consumoDiarioContestado,
    consumoDiarioAnteriorMedio,
    variacaoConsumoDiario,
    avisoDiasFaturados,
    avisoTipoLeitura,

    custoMedioKwhContestado,
    custoMedioKwhAnteriorMedio,
    variacaoCustoMedioKwh,

    referenciaAplicada,
    valorEsperadoReferencia,
    estimatedExcessAmount,

    statusBadge,
    title,
    description,
    explicacaoVariaveis,
    recomendacaoProvidencia,
    isEligibleForComplaint,
    onlyTwoBills: previous.length === 1,
  };
}

export function generateProconEmail(result: CalculationResult, user: UserComplaintData): string {
  const nome = user.nome.trim() || '[NOME COMPLETO DO TITULAR]';
  const cpf = user.cpf.trim() || '[000.000.000-00]';
  const endereco = user.endereco.trim() || '[ENDEREÇO COMPLETO, TAQUARA/RS]';
  const telefone = user.telefone.trim() || '[TELEFONE / WHATSAPP]';
  const email = user.email.trim() || '[SEU E-MAIL]';
  const uc = user.uc.trim() || '[Nº DA INSTALAÇÃO / UNIDADE CONSUMIDORA RGE]';

  const contestedPeriod = formatMonthYear(result.contestedBill.period);
  const contestedVal = formatBRL(result.contestedValor);

  const anterioresStr = result.previousBills
    .map((b) => {
      const v = parseNumber(b.valor);
      const c = parseNumber(b.consumo) > 0 ? ` (${b.consumo} kWh)` : '';
      const d = b.diasFaturados ? ` [${b.diasFaturados} dias]` : '';
      return `${formatMonthYear(b.period)}: R$ ${formatBRL(v)}${c}${d}`;
    })
    .join(' e ');

  const mediaValor = formatBRL(result.avgPreviousValor);
  const variacaoValorStr = formatPercent(result.variacaoValorTotal);

  let demonstrativoTriplo = `
- Conta objeto de solicitação (${contestedPeriod}): R$ ${contestedVal}${
    result.contestedConsumo ? ` (${result.contestedConsumo} kWh - ${result.diasFaturadosContestado} dias faturados)` : ''
  }
- Faturas de referência anterior: ${anterioresStr}
- Média do valor das faturas anteriores: R$ ${mediaValor}
- Variação apurada no valor total: ${variacaoValorStr}`;

  if (result.hasKwh && result.variacaoConsumoTotal !== undefined && result.variacaoCustoMedioKwh !== undefined) {
    demonstrativoTriplo += `
- Variação do consumo em kWh: ${formatPercent(result.variacaoConsumoTotal)}
- Consumo médio diário: ${result.consumoDiarioContestado?.toFixed(1)} kWh/dia (na fatura recente) vs ${result.consumoDiarioAnteriorMedio?.toFixed(1)} kWh/dia (na média anterior)
- Custo médio da fatura por kWh anterior: R$ ${formatBRL(result.custoMedioKwhAnteriorMedio)} / kWh
- Custo médio da fatura por kWh recente: R$ ${formatBRL(result.custoMedioKwhContestado)} / kWh
- Variação do custo médio por kWh: ${formatPercent(result.variacaoCustoMedioKwh)}`;
  }

  const protocoloInfo = user.protocoloRGE
    ? `\n- Protocolo de atendimento prévio junto à RGE: ${user.protocoloRGE}${
        user.dataProtocoloRGE ? ` (Data: ${user.dataProtocoloRGE})` : ''
      }${user.respostaRGE ? `\n- Resposta / posicionamento da concessionária: ${user.respostaRGE}` : ''}`
    : '';

  const relatoExtra = user.observacoes.trim()
    ? `\n\n4. OBSERVAÇÕES E RELATO DO CONSUMIDOR:\n${user.observacoes.trim()}\n`
    : '';

  return `Para: procon@taquara.rs.gov.br
Assunto: Solicitação de Análise e Esclarecimento - Fatura de Energia Elétrica RGE (${contestedPeriod}) - UC: ${uc}

Ao Órgão de Proteção e Defesa do Consumidor - Procon de Taquara / RS,

Eu, ${nome}, portador(a) do CPF nº ${cpf}, residente e domiciliado(a) em ${endereco}, venho por meio deste solicitar a intervenção e mediação deste órgão em face da concessionária RGE Sul Distribuidora de Energia S.A., em razão dos fatos abaixo expostos:

1. DADOS DA UNIDADE CONSUMIDORA:
- Titular da Conta: ${nome}
- Código da Instalação / Unidade Consumidora (UC): ${uc}
- Município: Taquara / RS${protocoloInfo}

2. DEMONSTRATIVO DA COMPARAÇÃO DE FATURAS:${demonstrativoTriplo}

3. SOLICITAÇÃO E PEDIDOS:
Diante da variação constatada na triagem das faturas informadas, solicito a mediação deste órgão para que a concessionária apresente:
a) A memória de cálculo completa e discriminada da fatura referente ao período de ${contestedPeriod};
b) O histórico das leituras do medidor (com confirmação se foram realizadas leituras reais, estimadas ou por média);
c) A discriminação e justificativa detalhada de quaisquer encargos, bandeiras tarifárias, tributos, refaturamentos ou lançamentos extraordinários aplicados;
d) A revisão do valor faturado caso constatada divergência de medição ou equívoco de faturamento;
e) A suspensão provisória de medidas coercitivas de cobrança ou corte de fornecimento enquanto tramita a análise da contestação, quando cabível.

Declaro que anexo a este e-mail as cópias das faturas comparadas e, quando disponíveis, fotografias do medidor e protocolos de atendimento.

Taquara/RS, ${new Date().toLocaleDateString('pt-BR')}.

Atenciosamente,
${nome}
Telefone / Contato: ${telefone}
E-mail: ${email}`;
}
