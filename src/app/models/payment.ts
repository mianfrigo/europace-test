export interface RepaymentPlanEntry {
  date: string;
  residualDebt: number;
  interestCharges: number;
  repayment: number;
  rate: number;
}

export interface PaymentInputs {
  loanAmount: number;
  interestRate: number;
  initialRepayment: number;
  fixationPeriod: number;
  startDate: Date;
}
