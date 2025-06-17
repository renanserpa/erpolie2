"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getRecordById } from '@/lib/data-hooks';
import { InsumoForm } from '../../_components/InsumoForm';
import type { Insumo } from '@/modules/estoque/estoque.types';

export default function EditInsumoPage(): React.JSX.Element | null {
  const params = useParams() as { id?: string };
  const router = useRouter();

  const [insumo, setInsumo] = useState<Insumo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsumo = async () => {
      if (!params?.id) return;

      try {
        setLoading(true);
        setError(null);

        const result = await getRecordById('supplies', params.id);
        if (result.success) {
          setInsumo(result.data);
        } else {
          // Dados mockados
          setInsumo({
            id: params.id,
            name: 'Insumo Exemplo',
            description: 'Descrição detalhada do insumo exemplo',
            price: 29.9,
            current_stock: 100,
            minimum_stock: 20,
            unit_of_measurement_id: null,
            supplier_id: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          console.warn('Usando dados mockados para insumo');
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error('Error fetching insumo details:', error);
        setError(error.message || 'Erro ao carregar detalhes do insumo');
        toast.error('Erro ao carregar detalhes do insumo.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsumo();
  }, [params?.id]);

  if (!params?.id) return null;

  const handleSuccess = () => {
    toast.success('Insumo atualizado com sucesso');
    router.push(`/insumos/${params.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados do insumo...</span>
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
        <h1 className="text-3xl font-bold ml-4">Editar Insumo</h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Formulário de Insumo</CardTitle>
        </CardHeader>
        <CardContent>
          {insumo && (
            <InsumoForm
              initialData={insumo}
              onSuccess={handleSuccess}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
