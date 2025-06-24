"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createRecord, updateRecord } from "@/lib/data-hooks";
import type { StockItem } from "@/types/schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  id: z.string().optional(), // utilizado apenas na edição
  name: z.string().min(1, "Nome obrigatório"),
  description: z.string().optional(),
  quantity: z.coerce.number().nonnegative(),
  unit: z.string().min(1, "Unidade obrigatória"),
});

type FormValues = z.infer<typeof formSchema>;

interface InsumoFormProps {
  initialData?: Partial<FormValues>;
  onSuccess: () => void;
}

export function InsumoForm({ initialData, onSuccess }: InsumoFormProps): React.JSX.Element {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id ?? undefined,
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      quantity: initialData?.quantity ?? 0,
      unit: initialData?.unit ?? "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: FormValues): Promise<void> {
    try {
      if (initialData?.id) {
        const { error } = await updateRecord<StockItem>(
          "stock_items",
          initialData.id,
          {
            name: data.name,
            description: data.description,
            quantity: data.quantity,
            unit: data.unit,
          },
        );
        if (error) {
          toast.error("Erro ao salvar insumo");
          console.error(error);
          return;
        }
      } else {
        const { error } = await createRecord<StockItem>("stock_items", {
          name: data.name,
          description: data.description,
          quantity: data.quantity,
          unit: data.unit,
        });
        if (error) {
          toast.error("Erro ao criar insumo");
          console.error(error);
          return;
        }
      }

      toast.success("Insumo salvo com sucesso");
      onSuccess();
      router.push("/insumos");
    } catch (error) {
      console.error("Erro ao salvar insumo:", error);
      toast.error("Erro ao salvar insumo");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nome</label>
        <Input {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Descrição</label>
        <Input {...register("description")} />
      </div>
      <div>
        <label className="block text-sm font-medium">Quantidade</label>
        <Input type="number" {...register("quantity", { valueAsNumber: true })} />
        {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Unidade</label>
        <Input {...register("unit")} />
        {errors.unit && <p className="text-sm text-red-500">{errors.unit.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
