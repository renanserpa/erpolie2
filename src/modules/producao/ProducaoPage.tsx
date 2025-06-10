"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/app/(dashboard)/producao/_components/columns';
import { ProducaoKanban } from './components/ProducaoKanban';
import { useDebounce } from '@/hooks/use-debounce';
import { fetchOrdensProducao, fetchEtapasProducao } from './ProducaoService';
import type { EtapaDeProducao, OrdemDeProducao } from './producao.types';

export default function ProducaoPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [ops, setOps] = useState<OrdemDeProducao[]>([]);
  const [etapas, setEtapas] = useState<EtapaDeProducao[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');

  const debouncedSearch = useDebounce(searchQuery, 500);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const query: Record<string, unknown> = {};
      if (debouncedSearch) {
        query.production_order_number = `ilike.%${debouncedSearch}%`;
      }
      const [opsRes, etapasRes] = await Promise.all([
        fetchOrdensProducao(query),
        fetchEtapasProducao(),
      ]);
      if (opsRes.success) setOps(opsRes.data || []);
      else setError(opsRes.error || 'Erro ao buscar ordens');
      if (etapasRes.success) setEtapas(etapasRes.data || []);
    } catch (err) {
      const e = err as Error;
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Painel de Produção</h1>
        <Button variant="outline" onClick={() => setView(view === 'table' ? 'kanban' : 'table')}>
          {view === 'table' ? 'Kanban' : 'Tabela'}
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Ordens de Produção</CardTitle>
          <div className="mt-4">
            <Input
              placeholder="Buscar OP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
          {view === 'kanban' ? (
            <ProducaoKanban ordens={ops} etapas={etapas} loading={isLoading} />
          ) : (
            <DataTable columns={columns} data={ops} loading={isLoading} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
