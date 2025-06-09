"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { productColumns } from '@/app/(dashboard)/produtos/_components/ProductColumns';
import { Plus } from 'lucide-react';
import { ProductForm } from '@/app/(dashboard)/produtos/_components/ProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { fetchProdutos } from './ProdutosService';
import type { Product as ColumnProduct } from '@/app/(dashboard)/produtos/_components/ProductColumns';

export default function ProdutosPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [produtos, setProdutos] = useState<ColumnProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const query: Record<string, unknown> = {};
      if (debouncedSearchQuery) {
        query.name = `ilike.%${debouncedSearchQuery}%`;
      }
      const result = await fetchProdutos(query);
      if (result.success) {
        const mapped: ColumnProduct[] = (result.data || []).map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku ?? undefined,
          description: p.description ?? undefined,
          category_id: p.category_id ?? undefined,
          category_name: (p as any).category?.name,
          price: p.price ?? undefined,
          cost: p.cost ?? undefined,
          stock_quantity: (p as any).stock_quantity ?? undefined,
          image_url: (p as any).image_url ?? undefined,
          status: p.is_active ? 'Ativo' : 'Inativo',
          is_active: p.is_active,
          created_at: p.created_at,
        }));
        setProdutos(mapped);
      } else {
        setProdutos([]);
        setError(result.error || 'Erro ao buscar produtos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery]);

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
        <h1 className="text-3xl font-bold">Gestão de Produtos</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[850px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Produto</DialogTitle>
            </DialogHeader>
            <ProductForm onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gerenciar Produtos</CardTitle>
          <div className="mt-4">
            <Input
              placeholder="Buscar produtos..."
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
          <DataTable columns={productColumns} data={produtos} loading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
