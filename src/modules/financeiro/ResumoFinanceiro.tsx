"use client";
import React from 'react';
import type { FinancialTransaction } from '@/app/(dashboard)/financeiro/_components/TransactionColumns';

interface ResumoFinanceiroProps {
  data: FinancialTransaction[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export function ResumoFinanceiro({ data }: ResumoFinanceiroProps) {
  const receitas = data.filter(t => t.is_income).reduce((sum, t) => sum + t.amount, 0);
  const despesas = data.filter(t => !t.is_income).reduce((sum, t) => sum + t.amount, 0);
  const saldo = receitas - despesas;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/30">
        <p className="text-sm">Receitas</p>
        <p className="text-xl font-bold">{formatCurrency(receitas)}</p>
      </div>
      <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/30">
        <p className="text-sm">Despesas</p>
        <p className="text-xl font-bold">{formatCurrency(despesas)}</p>
      </div>
      <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800/30">
        <p className="text-sm">Saldo</p>
        <p className="text-xl font-bold">{formatCurrency(saldo)}</p>
      </div>
    </div>
  );
}
