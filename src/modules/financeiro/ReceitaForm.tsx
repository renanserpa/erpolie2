"use client";
import React from 'react';
import { FinancialTransactionForm } from '@/app/(dashboard)/financeiro/_components/FinancialTransactionForm';
import type { FinancialTransaction } from '@/app/(dashboard)/financeiro/_components/TransactionColumns';

interface ReceitaFormProps {
  initialData?: Partial<FinancialTransaction> & { id?: string };
  onSuccess: () => void;
}

export function ReceitaForm({ initialData, onSuccess }: ReceitaFormProps) {
  return (
    <FinancialTransactionForm
      initialData={initialData}
      onSuccess={onSuccess}
      transactionType="Receita"
    />
  );
}
