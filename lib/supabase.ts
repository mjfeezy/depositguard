import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Browser client (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client for API routes (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

// Types
export type CaseData = {
  tenant_name?: string;
  tenant_email?: string;
  tenant_address?: string;
  landlord_name?: string;
  landlord_email?: string;
  property_address?: string;
  deposit_amount?: number;
  amount_returned?: number;
  lease_end_date?: string;
  tenancy_duration_months?: number;
  itemization_received?: boolean;
  itemization_date?: string;
  receipts_included?: boolean;
  deductions?: Array<{
    category: string;
    amount: number;
    description: string;
    age_years?: number;
    lifespan_years?: number;
    fair_amount?: number;
  }>;
  leverage_points?: string[];
  outcome_type?: string;
  analysis_summary?: string;
  state?: string;
};

export type Case = {
  id: string;
  created_at: string;
  updated_at: string;
  status: 'intake' | 'ready' | 'paid';
  payment_status: string;
  stripe_session_id: string | null;
  case_data: CaseData;
  generated_letter: GeneratedLetter | null;
};

export type GeneratedLetter = {
  subject: string;
  body: string;
  send_to_email: string;
  applicable_statutes: string[];
  outcome_type: string;
  explanation: string;
  deposit_withheld: number;
  penalty_amount: number;
};

export type Message = {
  id: string;
  created_at: string;
  case_id: string;
  role: 'user' | 'assistant';
  content: string;
};
