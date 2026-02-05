// California-specific rules for security deposit claims
export const californiaRules = {
  maxDepositAmount: {
    unfurnished: 2, // 2 months' rent
    furnished: 3, // 3 months' rent
  },
  returnDeadline: 21, // days
  interestRequired: false,
  allowableDeductions: [
    'Unpaid rent',
    'Damage beyond normal wear and tear',
    'Cleaning to return to move-in condition',
  ],
  requiredDocumentation: [
    'Itemized statement of deductions',
    'Receipts for repairs over $126',
    'Before and after photos',
  ],
};

export const stateRules = {
  CA: californiaRules,
};

export function getStateRules(state: string) {
  return stateRules[state as keyof typeof stateRules] || null;
}

export function getAvailableStates(): Array<{ code: string; name: string }> {
  return [
    { code: 'CA', name: 'California' }
  ];
}

export function getStateName(code: string): string {
  const states: { [key: string]: string } = {
    CA: 'California'
  };
  return states[code] || code;
}
