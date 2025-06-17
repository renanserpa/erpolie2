"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getRecordById } from '@/lib/data-hooks';
import type { Client } from '@/types/schema';
import { ClientForm } from '../../_components/ClientForm';

export default function EditClientPage() {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientId = params?.id;

  const fetchClient = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!clientId) return;
      const result = await getRecordById<Client>('clients', clientId);
      
      if (result.success) {
        setClient(result.data || null);
      } else {
        setError('Cliente não encontrado.');
      }
    } catch (err: unknown) {
      console.error('Error fetching client details:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao carregar detalhes do cliente');
      }
      toast.error('Erro ao carregar detalhes do cliente.');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  if (!clientId) {
    return <div>Cliente não encontrado.</div>;
  }

  const handleSuccess = () => {
    toast.success('Cliente atualizado com sucesso');
    router.push(`/clientes/${params.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados do cliente...</span>
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
        <h1 className="text-3xl font-bold ml-4">Editar Cliente</h1>
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
          <CardTitle>Formulário de Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          {client && (
            <ClientForm
              initialData={client}
              onSuccess={handleSuccess}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
