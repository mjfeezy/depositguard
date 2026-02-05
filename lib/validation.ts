import { z } from 'zod';

export const intakeFormSchema = z.object({
  // Location & Lease Info
  state: z.string().min(1, 'State is required'),
  lease_end_date: z.string().min(1, 'Lease end date is required'),
  
  // Deposit Amounts
  deposit_amount: z.number().min(1, 'Deposit amount must be greater than 0'),
  amount_returned: z.number().min(0, 'Amount returned cannot be negative'),
  
  // Itemization Info
  itemization_received: z.enum(['yes', 'no'], {
    required_error: 'Please select whether you received an itemization',
  }),
  itemization_date: z.string().optional(),
  receipts_included: z.enum(['yes', 'no', 'partial']).optional(),
  
  // Deduction Type
  deduction_type: z.enum(['unclear', 'excessive', 'normal_wear', 'fraudulent'], {
    required_error: 'Please select a deduction type',
  }),
  
  // Contact Info
  landlord_email: z.string().email('Invalid email address'),
  tenant_name: z.string().min(1, 'Your name is required'),
  tenant_address: z.string().min(1, 'Your address is required'),
}).refine(
  (data) => {
    // If itemization received, date is required
    if (data.itemization_received === 'yes' && !data.itemization_date) {
      return false;
    }
    return true;
  },
  {
    message: 'Itemization date is required when itemization was received',
    path: ['itemization_date'],
  }
);

export type IntakeFormData = z.infer<typeof intakeFormSchema>;
