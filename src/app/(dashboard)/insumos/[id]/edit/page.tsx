"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { InsumoForm } from "@/app/(dashboard)/insumos/_components/InsumoForm";
import type { Insumo } from "@/modules/estoque/estoque.types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface PageProps {
  params: { id?: string };
}

export default function EditarInsumoPage({ params }: PageProps): React.JSX.Element {
  const supabase = createClient();
  const router = useRouter();
  const [initialData, setInitialData] = useState<Insumo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      if (!params?.id) {
        toast.error("ID do insumo não encontrado.");
        router.push("/dashboard/insumos");
        return;
      }

      const { data, error } = await supabase
        .from("stock_items")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        toast.error("Erro ao carregar insumo.");
        router.push("/dashboard/insumos");
        return;
      }

      setInitialData(data as Insumo);
      setLoading(false);
    }

    fetchData();
  }, [params?.id, supabase, router]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Editar Insumo</h1>
      {initialData && (
        <InsumoForm
          initialData={initialData}
          onSuccess={() => router.push("/dashboard/insumos")}
        />
      )}
    </div>
  );
}
