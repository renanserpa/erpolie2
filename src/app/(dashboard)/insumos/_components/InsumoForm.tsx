"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  id: z.string().optional(), // necessário para update
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
  const supabase = createClient();

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

  async function onSubmit(data: FormValues): Promise<void> {
    if (!data.id) {
      toast.error("ID do insumo ausente.");
      return;
    }

    const { error } = await supabase
      .from("stock_items")
      .update({
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        unit: data.unit,
      })
      .eq("id", data.id);

    if (error) {
      toast.error("Erro ao salvar insumo");
    } else {
      toast.success("Insumo salvo com sucesso");
      onSuccess();
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
