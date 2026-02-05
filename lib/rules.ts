// General validation and business rules
export const formRules = {
  minDepositAmount: 100,
  maxDepositAmount: 50000,
  minDaysWaited: 0,
  maxDaysWaited: 365,
  requiredFields: [
    'tenantName',
    'tenantAddress',
    'landlordName',
    'landlordAddress',
    'depositAmount',
    'moveOutDate',
  ],
};

export function validateDepositAmount(amount: number): boolean {
  return amount >= formRules.minDepositAmount && amount <= formRules.maxDepositAmount;
}

export function validateDaysWaited(days: number): boolean {
  return days >= formRules.minDaysWaited && days <= formRules.maxDaysWaited;
}

export function calculatePenalty(depositAmount: number, daysLate: number): number {
  // California penalty: deposit amount x 2 if landlord acted in bad faith
  if (daysLate > 21) {
    return depositAmount * 2;
  }
  return 0;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
