export interface ReferenciaTarifaria {
  distribuidora: string;
  classe: 'residencial' | 'comercial' | 'rural' | 'outros';
  grupo: string;
  vigenciaInicial: string; // YYYY-MM-DD
  vigenciaFinal: string | null;
  percentualReferencia: number;
  resolucao: string;
  fonte: string;
  descricao: string;
}

export type TipoLeitura = 'real' | 'estimada' | 'media';

export interface BillEntry {
  id: string;
  period: string; // YYYY-MM
  valor: number | string;
  consumo: number | string; // kWh
  diasFaturados?: number | string; // Dias no ciclo faturado (ex: 30)
  dataLeituraAnterior?: string; // DD/MM/AAAA
  dataLeituraAtual?: string; // DD/MM/AAAA
  tipoLeitura?: TipoLeitura;
  fileName?: string;
}

export type DiagnosticCategory =
  | 'dados_insuficientes'
  | 'aumento_consumo'
  | 'componentes_adicionais'
  | 'divergencia_aparente'
  | 'encaminhamento_procon';

export interface CalculationResult {
  valid: boolean;
  errorMessage?: string;
  diagnosticCategory: DiagnosticCategory;
  contestedBill: BillEntry;
  previousBills: BillEntry[];

  // Valores totais (R$)
  avgPreviousValor: number;
  contestedValor: number;
  variacaoValorTotal: number; // %

  // Consumo (kWh)
  avgPreviousConsumo?: number;
  contestedConsumo?: number;
  variacaoConsumoTotal?: number; // %
  hasKwh: boolean;

  // Dias faturados & consumo diário (kWh/dia)
  diasFaturadosContestado: number;
  diasFaturadosAnteriorMedio: number;
  consumoDiarioContestado?: number;
  consumoDiarioAnteriorMedio?: number;
  variacaoConsumoDiario?: number; // %
  avisoDiasFaturados?: string;
  avisoTipoLeitura?: string;

  // Custo médio da fatura por kWh (R$/kWh)
  custoMedioKwhContestado?: number;
  custoMedioKwhAnteriorMedio?: number;
  variacaoCustoMedioKwh?: number; // %

  // Referência tarifária aplicada
  referenciaAplicada: ReferenciaTarifaria;
  valorEsperadoReferencia: number;
  estimatedExcessAmount: number;

  // Textos e orientações
  statusBadge: 'verde' | 'amarelo' | 'laranja' | 'vermelho' | 'cinza';
  title: string;
  description: string;
  explicacaoVariaveis: string;
  recomendacaoProvidencia: string;
  isEligibleForComplaint: boolean;
  onlyTwoBills: boolean;
}

export interface UserComplaintData {
  nome: string;
  cpf: string;
  endereco: string;
  telefone: string;
  email: string;
  uc: string; // Unidade Consumidora / Código do Cliente RGE
  protocoloRGE?: string;
  dataProtocoloRGE?: string;
  respostaRGE?: string;
  observacoes: string;
}
