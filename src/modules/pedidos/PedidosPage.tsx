"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/app/(dashboard)/pedidos/_components/columns';
import { OrderKanbanBoard } from '@/app/(dashboard)/pedidos/_components/OrderKanbanBoard';
import type { Order as Pedido } from "@/types/schema";
import { OrderForm } from '@/app/(dashboard)/pedidos/_components/OrderForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { fetchPedidos, fetchOrderStatuses } from './PedidosService';

export default function PedidosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [statuses, setStatuses] = useState<{ id: string; name: string; color?: string | null }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [view, setView] = useState<'table' | 'kanban'>('table');

  const debouncedSearch = useDebounce(searchQuery, 500);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const query: Record<string, unknown> = {};
      if (debouncedSearch) {
        query.order_number = `ilike.%${debouncedSearch}%`;
      }
      const result = await fetchPedidos(query);
      if (result.success) {
        setPedidos(result.data || []);
      } else {
        setPedidos([]);
        setError(result.error || 'Erro ao buscar pedidos');
      }
      const statusRes = await fetchOrderStatuses();
      if (statusRes.success) {
        setStatuses(statusRes.data || []);
      }
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

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    loadData();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Pedidos</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView(view === 'table' ? 'kanban' : 'table')}>
            {view === 'table' ? 'Kanban' : 'Tabela'}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Novo Pedido</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px]">
              <DialogHeader>
                <DialogTitle>Criar Pedido</DialogTitle>
              </DialogHeader>
              <OrderForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gerenciar Pedidos</CardTitle>
          <div className="mt-4">
            <Input
              placeholder="Buscar pedidos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-red-600 text-sm" data-testid="error-message">
              {error}
            </div>
          )}
          {view === 'table' ? (
            <DataTable columns={columns} data={pedidos} loading={isLoading} />
          ) : (
            <OrderKanbanBoard orders={pedidos} statuses={statuses} loading={isLoading} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
