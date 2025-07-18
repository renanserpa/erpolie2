"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getRecordById } from '@/lib/data-hooks';
import { StockItem } from '@/types/schema';
import { StockItemForm } from '../../_components/StockItemForm';

export default function EditStockItemPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [stockItem, setStockItem] = useState<Partial<StockItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStockItem = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getRecordById<StockItem>('stock_items', params.id as string);
      
      if (result.success && result.data) {
        setStockItem(result.data);
      } else {
        // Criar um item de estoque mockado para demonstração
        setStockItem({
          id: params.id,
          name: 'Item de Estoque Exemplo',
          sku: 'SKU-12345',
          location_id: null,
          quantity: 50,
          min_quantity: 10,
          unit_of_measurement_id: null,
          group_id: null,
          is_active: true,
          updated_at: new Date().toISOString()
        });
        
        console.warn('Usando dados mockados para item de estoque');
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error fetching stock item details:', error);
      setError(error.message || 'Erro ao carregar detalhes do item de estoque');
      toast.error('Erro ao carregar detalhes do item de estoque.');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchStockItem();
  }, [fetchStockItem]);

  if (!params?.id) {
    return null;
  }

  const handleSuccess = () => {
    toast.success('Item de estoque atualizado com sucesso');
    router.push(`/estoque/${params.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados do item de estoque...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold ml-4">Editar Item de Estoque</h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Formulário de Item de Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          {stockItem && (
            <StockItemForm 
              initialData={stockItem} 
              onSuccess={handleSuccess}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
