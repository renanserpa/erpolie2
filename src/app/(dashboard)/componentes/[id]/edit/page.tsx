"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getRecordById } from "@/lib/data-hooks";
import type { Component } from "@/types/schema";
import { ComponentForm } from "../../_components/ComponentForm";

export default function EditComponentPage() {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const [component, setComponent] = useState<Component | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComponent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getRecordById<Component>(
        "components",
        params.id as string,
      );

      if (result.success) {
        setComponent(result.data ?? null);
      } else {
        setError("Componente não encontrado.");
      }
    } catch (err: unknown) {
      console.error("Error fetching component details:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao carregar detalhes do componente");
      }
      toast.error("Erro ao carregar detalhes do componente.");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchComponent();
  }, [fetchComponent]);

  if (!params?.id) return null;

  const handleSuccess = () => {
    toast.success("Componente atualizado com sucesso");
    router.push(`/componentes/${params.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados do componente...</span>
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
        <h1 className="text-3xl font-bold ml-4">Editar Componente</h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Formulário de Componente</CardTitle>
        </CardHeader>
        <CardContent>
          {component && (
            <ComponentForm initialData={component} onSuccess={handleSuccess} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
