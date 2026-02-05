'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { intakeFormSchema, IntakeFormData } from '@/lib/validation';
import { getAvailableStates, getStateName } from '@/lib/stateRules';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Error icon component for enhanced error display
function ErrorIcon() {
  return (
    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );
}

export default function IntakePage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      state: 'CA',
      itemization_received: 'no',
      deduction_type: 'unclear'
    }
  });

  const itemizationReceived = watch('itemization_received');
  const availableStates = getAvailableStates();
  
  const onSubmit = async (data: IntakeFormData) => {
    try {
      setSubmitError(null);
      
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }
      
      if (result.case_id) {
        router.push(`/summary?case_id=${result.case_id}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Security Deposit Questionnaire
          </h1>
          <p className="mt-2 text-gray-600">
            Answer these questions to generate your demand letter
          </p>
        </div>
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                1
              </div>
              <span className="ml-2 font-medium text-gray-900">Questions</span>
            </div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
                2
              </div>
              <span className="ml-2 text-gray-500">Summary</span>
            </div>
            <div className="w-16 h-1 bg-gray-200"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold">
                3
              </div>
              <span className="ml-2 text-gray-500">Letter</span>
            </div>
          </div>
        </div>
        
        {/* Error Alert - ENHANCED */}
        {submitError && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-md p-4">
            <ErrorIcon />
            <p className="text-sm text-red-800 font-medium">{submitError}</p>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm rounded-lg p-8 space-y-6">
          {/* State Selection */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <select
              id="state"
              {...register('state')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              {availableStates.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                <ErrorIcon />
                <p className="text-sm text-red-800 font-medium">{errors.state.message}</p>
              </div>
            )}
          </div>

          {/* Lease End Date */}
          <div>
            <label htmlFor="lease_end_date" className="block text-sm font-medium text-gray-700 mb-1">
              When did your lease end? *
            </label>
            <input
              id="lease_end_date"
              type="date"
              {...register('lease_end_date')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {errors.lease_end_date && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                <ErrorIcon />
                <p className="text-sm text-red-800 font-medium">{errors.lease_end_date.message}</p>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">The date you moved out or your lease officially ended</p>
          </div>

          {/* Deposit Amount */}
          <div>
            <label htmlFor="deposit_amount" className="block text-sm font-medium text-gray-700 mb-1">
              Security deposit amount paid *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="deposit_amount"
                type="number"
                step="0.01"
                {...register('deposit_amount', { valueAsNumber: true })}
                className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="2000.00"
              />
            </div>
            {errors.deposit_amount && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                <ErrorIcon />
                <p className="text-sm text-red-800 font-medium">{errors.deposit_amount.message}</p>
              </div>
            )}
          </div>

          {/* Amount Returned */}
          <div>
            <label htmlFor="amount_returned" className="block text-sm font-medium text-gray-700 mb-1">
              Amount returned to you *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="amount_returned"
                type="number"
                step="0.01"
                {...register('amount_returned', { valueAsNumber: true })}
                className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="500.00"
              />
            </div>
            {errors.amount_returned && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                <ErrorIcon />
                <p className="text-sm text-red-800 font-medium">{errors.amount_returned.message}</p>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">Enter 0 if you received nothing back</p>
          </div>

          {/* Itemization Received - ENHANCED TOUCH TARGETS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Did you receive an itemized statement of deductions? *
            </label>
            <div className="space-y-3">
              <label className="flex items-center min-h-[44px] cursor-pointer">
                <input
                  type="radio"
                  {...register('itemization_received')}
                  value="yes"
                  className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">Yes, I received an itemized list of deductions</span>
              </label>
              <label className="flex items-center min-h-[44px] cursor-pointer">
                <input
                  type="radio"
                  {...register('itemization_received')}
                  value="no"
                  className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">No, I did not receive any itemization</span>
              </label>
            </div>
            {errors.itemization_received && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                <ErrorIcon />
                <p className="text-sm text-red-800 font-medium">{errors.itemization_received.message}</p>
              </div>
            )}
          </div>

          {/* Conditional Fields - Only show if itemization received */}
          {itemizationReceived === 'yes' && (
            <div className="pl-6 border-l-2 border-blue-200 space-y-6 transition-all">
              <div>
                <label htmlFor="itemization_date" className="block text-sm font-medium text-gray-700 mb-1">
                  When did you receive the itemization? *
                </label>
                <input
                  id="itemization_date"
                  type="date"
                  {...register('itemization_date')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {errors.itemization_date && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                    <ErrorIcon />
                    <p className="text-sm text-red-800 font-medium">{errors.itemization_date.message}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Were receipts or invoices included? *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center min-h-[44px] cursor-pointer">
                    <input
                      type="radio"
                      {...register('receipts_included')}
                      value="yes"
                      className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">Yes, receipts or invoices were included</span>
                  </label>
                  <label className="flex items-center min-h-[44px] cursor-pointer">
                    <input
                      type="radio"
                      {...register('receipts_included')}
                      value="no"
                      className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">No receipts or invoices</span>
                  </label>
                  <label className="flex items-center min-h-[44px] cursor-pointer">
                    <input
                      type="radio"
                      {...register('receipts_included')}
                      value="not_sure"
                      className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">Not sure / unclear</span>
                  </label>
                </div>
                {errors.receipts_included && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                    <ErrorIcon />
                    <p className="text-sm text-red-800 font-medium">{errors.receipts_included.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Deduction Type */}
          <div>
            <label htmlFor="deduction_type" className="block text-sm font-medium text-gray-700 mb-1">
              What were the deductions for? *
            </label>
            <select
              id="deduction_type"
              {...register('deduction_type')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="wear_tear">Normal wear and tear</option>
              <option value="cleaning_repairs">Cleaning and repairs</option>
              <option value="unclear">Not sure / Unclear</option>
            </select>
            {errors.deduction_type && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                <ErrorIcon />
                <p className="text-sm text-red-800 font-medium">{errors.deduction_type.message}</p>
              </div>
            )}
          </div>

          {/* Landlord Email */}
          <div>
            <label htmlFor="landlord_email" className="block text-sm font-medium text-gray-700 mb-1">
              Landlord's email address *
            </label>
            <input
              id="landlord_email"
              type="email"
              {...register('landlord_email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="landlord@example.com"
            />
            {errors.landlord_email && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                <ErrorIcon />
                <p className="text-sm text-red-800 font-medium">{errors.landlord_email.message}</p>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">This will appear as the "send to" address in your letter</p>
          </div>

          {/* Tenant Name */}
          <div>
            <label htmlFor="tenant_name" className="block text-sm font-medium text-gray-700 mb-1">
              Your full name *
            </label>
            <input
              id="tenant_name"
              type="text"
              {...register('tenant_name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="John Doe"
            />
            {errors.tenant_name && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                <ErrorIcon />
                <p className="text-sm text-red-800 font-medium">{errors.tenant_name.message}</p>
              </div>
            )}
          </div>

          {/* Tenant Address (Optional) */}
          <div>
            <label htmlFor="tenant_address" className="block text-sm font-medium text-gray-700 mb-1">
              Your current mailing address <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              id="tenant_address"
              type="text"
              {...register('tenant_address')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="123 Main St, City, State 12345"
            />
            {errors.tenant_address && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                <ErrorIcon />
                <p className="text-sm text-red-800 font-medium">{errors.tenant_address.message}</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Continue to Summary'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
