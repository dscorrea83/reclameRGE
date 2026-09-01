export interface BillEntry {
  id: string;
  period: string; // YYYY-MM
  valor: number | string;
  consumo: number | string;
  fileName?: string;
}

export interface CalculationResult {
  valid: boolean;
  errorMessage?: string;
  contestedBill: BillEntry;
  previousBills: BillEntry[];
  avgPreviousValor: number;
  avgPreviousConsumo?: number;
  contestedValor: number;
  contestedConsumo?: number;
  percentageIncrease: number;
  rateContested?: number; // R$/kWh
  ratePreviousAvg?: number; // R$/kWh
  ratePercentageIncrease?: number;
  hasKwh: boolean;
  onlyTwoBills: boolean;
  estimatedExcessAmount: number;
  status: 'green' | 'yellow' | 'red';
  title: string;
  description: string;
  isEligibleForComplaint: boolean;
}

export interface UserComplaintData {
  nome: string;
  cpf: string;
  endereco: string;
  telefone: string;
  email: string;
  uc: string; // Unidade Consumidora / Código do Cliente RGE
  observacoes: string;
}
