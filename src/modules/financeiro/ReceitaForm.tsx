"use client";
import React from 'react';
import { FinancialTransactionForm } from '@/app/(dashboard)/financeiro/_components/FinancialTransactionForm';
import type { FinancialTransactionFormValues } from '@/app/(dashboard)/financeiro/_components/FinancialTransactionForm';
interface ReceitaFormProps {
  initialData?: Partial<FinancialTransactionFormValues> & { id?: string };
import type { LancamentoFinanceiro } from './financeiro.types';
interface ReceitaFormProps {
  initialData?: Partial<LancamentoFinanceiro> & { id?: string };
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
