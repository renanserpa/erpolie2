"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { fetchLancamentos } from './FinanceiroService';
import { LancamentosTable } from './LancamentosTable';
import { ResumoFinanceiro } from './ResumoFinanceiro';
import { ReceitaForm } from './ReceitaForm';
import type { FinancialTransaction } from '@/app/(dashboard)/financeiro/_components/TransactionColumns';
import { DespesaForm } from './DespesaForm';

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openReceita, setOpenReceita] = useState(false);
  const [openDespesa, setOpenDespesa] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const result = await fetchLancamentos();
    if (result.success) setTransactions(result.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <ResumoFinanceiro data={transactions} />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lançamentos Financeiros</CardTitle>
          <div className="flex gap-2">
            <Dialog open={openReceita} onOpenChange={setOpenReceita}>
              <DialogTrigger asChild>
                <Button>Novo Receita</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Lançar Receita</DialogTitle>
                </DialogHeader>
                <ReceitaForm onSuccess={() => { setOpenReceita(false); loadData(); }} />
              </DialogContent>
            </Dialog>
            <Dialog open={openDespesa} onOpenChange={setOpenDespesa}>
              <DialogTrigger asChild>
                <Button variant="outline">Nova Despesa</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Lançar Despesa</DialogTitle>
                </DialogHeader>
                <DespesaForm onSuccess={() => { setOpenDespesa(false); loadData(); }} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <LancamentosTable data={transactions} loading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
