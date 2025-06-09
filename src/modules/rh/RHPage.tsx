"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/data-table';
import { useDebounce } from '@/hooks/use-debounce';
import { ColaboradorForm } from './components/ColaboradorForm';
import { colaboradorColumns, type ColaboradorRow } from './components/ColaboradoresTable';
import { fetchColaboradores } from './RHService';

export default function RHPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [colaboradores, setColaboradores] = useState<ColaboradorRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 500);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const query: Record<string, unknown> = {};
      if (debouncedQuery) {
        query.name = `ilike.%${debouncedQuery}%`;
      }
      const result = await fetchColaboradores(query);
      if (result.success) {
        const mapped: ColaboradorRow[] = (result.data || []).map((e) => ({
          id: e.id,
          name: e.name,
          role: e.role ?? undefined,
          hire_date: e.hire_date,
          is_active: e.status === 'ACTIVE',
        }));
        setColaboradores(mapped);
      } else {
        setColaboradores([]);
        setError(result.error || 'Erro ao buscar colaboradores');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar colaboradores');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    fetchData();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Colaboradores</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Novo Colaborador</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Colaborador</DialogTitle>
            </DialogHeader>
            <ColaboradorForm onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Colaboradores</CardTitle>
          <div className="mt-4">
            <Input
              placeholder="Buscar colaboradores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
          <DataTable columns={colaboradorColumns} data={colaboradores} loading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
