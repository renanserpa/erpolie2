"use client";
import React from 'react';
import { FinancialTransactionForm } from '@/app/(dashboard)/financeiro/_components/FinancialTransactionForm';
import type { FinancialTransactionFormValues } from '@/app/(dashboard)/financeiro/_components/FinancialTransactionForm';
interface DespesaFormProps {
  initialData?: Partial<FinancialTransactionFormValues> & { id?: string };
import type { LancamentoFinanceiro } from './financeiro.types';
interface DespesaFormProps {
  initialData?: Partial<LancamentoFinanceiro> & { id?: string };
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
