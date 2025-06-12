"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createSupabaseClient } from '@/lib/supabase/client';
import { PurchaseRequestForm, type PurchaseRequestFormValues } from '../../_components/PurchaseRequestForm';
import type { PurchaseRequest } from '@/types/schema';

export default function EditPurchaseRequestPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [purchaseRequest, setPurchaseRequest] = useState<PurchaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchaseRequest = useCallback(async () => {
    if (!params?.id) return;
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('purchase_requests')
        .select(
          `
          id,
          status_id,
          requester_id,
          approver_id,
          request_date,
          approval_date,
          created_at,
          updated_at,
          purchase_request_statuses:status_id (id, name, color)
        `
        )
        .eq('id', params.id)
        .single()
        .returns<PurchaseRequest>();

      if (error) {
        setError('Erro ao buscar solicitação de compra');
      } else {
        setPurchaseRequest(data);
      }
    } catch (err: unknown) {
      console.error('Error fetching purchase request details:', err);
      const message = err instanceof Error ? err.message : 'Erro ao carregar detalhes da solicitação de compra';
      setError(message);
      toast.error('Erro ao carregar detalhes da solicitação de compra.');
    } finally {
      setLoading(false);
    }
  }, [params?.id, supabase]);

  useEffect(() => {
    fetchPurchaseRequest();
  }, [fetchPurchaseRequest]);

  if (!params?.id) return null;

  const handleSuccess = () => {
    toast.success('Solicitação de compra atualizada com sucesso');
    router.push(`/compras/${params.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados da solicitação de compra...</span>
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
        <h1 className="text-3xl font-bold ml-4">Editar Solicitação de Compra</h1>
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
          <CardTitle>Formulário de Solicitação de Compra</CardTitle>
        </CardHeader>
        <CardContent>
          {purchaseRequest && (
            <PurchaseRequestForm
              initialData={purchaseRequest as unknown as Partial<PurchaseRequestFormValues> & { id: string }}
              onSuccess={handleSuccess}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
