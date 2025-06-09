"use client";
import React from 'react';
import { FinancialTransactionForm } from '@/app/(dashboard)/financeiro/_components/FinancialTransactionForm';
import type { FinancialTransaction } from '@/app/(dashboard)/financeiro/_components/TransactionColumns';

interface DespesaFormProps {
  initialData?: Partial<FinancialTransaction> & { id?: string };
  onSuccess: () => void;
}

export function DespesaForm({ initialData, onSuccess }: DespesaFormProps) {
  return (
    <FinancialTransactionForm
      initialData={initialData}
      onSuccess={onSuccess}
      transactionType="Despesa"
    />
  );
}
