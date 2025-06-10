"use client";
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { transactionColumns } from '@/app/(dashboard)/financeiro/_components/TransactionColumns';
import type { LancamentoFinanceiro } from './financeiro.types';

interface LancamentosTableProps {
  data: LancamentoFinanceiro[];
  loading?: boolean;
}

export function LancamentosTable({ data, loading }: LancamentosTableProps) {
  return <DataTable columns={transactionColumns} data={data} loading={loading} />;
}
