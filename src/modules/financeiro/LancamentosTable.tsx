"use client";
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { transactionColumns } from '@/app/(dashboard)/financeiro/_components/TransactionColumns';
import type { FinancialTransaction } from '@/app/(dashboard)/financeiro/_components/TransactionColumns';

interface LancamentosTableProps {
  data: FinancialTransaction[];
  loading?: boolean;
}

export function LancamentosTable({ data, loading }: LancamentosTableProps) {
  return <DataTable columns={transactionColumns} data={data} loading={loading} />;
}
