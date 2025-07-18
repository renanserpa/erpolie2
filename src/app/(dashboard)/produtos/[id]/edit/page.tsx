"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getRecordById } from "@/lib/data-hooks";
import {
  ProductForm,
  type ProductFormValues,
} from "../../_components/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<
    (Partial<ProductFormValues> & { id: string }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getRecordById("products", params.id as string);

      if (result.success) {
        setProduct(result.data as Partial<ProductFormValues> & { id: string });
      } else {
        // Criar um produto mockado para demonstração
        setProduct({
          id: params.id as string,
          name: "Produto Exemplo",
          description: "Descrição detalhada do produto exemplo",
          sku: "SKU-12345",
          price: 99.9,
          cost: 59.9,
          stock_quantity: 50,
        });

        console.warn("Usando dados mockados para produto");
      }
    } catch (err: any) {
      console.error("Error fetching product details:", err);
      setError(err.message || "Erro ao carregar detalhes do produto");
      toast.error("Erro ao carregar detalhes do produto.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const handleSuccess = () => {
    toast.success("Produto atualizado com sucesso");
    router.push(`/produtos/${params.id as string}`);
  };

  if (!params?.id) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados do produto...</span>
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
        <h1 className="text-3xl font-bold ml-4">Editar Produto</h1>
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
          <CardTitle>Formulário de Produto</CardTitle>
        </CardHeader>
        <CardContent>
          {product && (
            <ProductForm initialData={product} onSuccess={handleSuccess} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
