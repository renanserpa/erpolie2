"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { updateRecord } from "@/lib/data-hooks";
import { toast } from "sonner";
import type { GrupoDeInsumo } from "@/modules/estoque/estoque.types";

// Define Zod schema based on the 'stock_groups' table
const groupFormSchema = z.object({
  name: z.string().min(2, { message: "Nome do grupo deve ter pelo menos 2 caracteres." }),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

interface GroupFormProps {
  initialData?: Partial<GrupoDeInsumo>; // For editing
  onSuccess?: () => void; // Callback after successful submission
}

export function GroupForm({ initialData, onSuccess }: GroupFormProps) {
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: initialData ? {
      name: initialData.name || "",
      description: initialData.description || "",
      is_active: initialData.is_active !== false
    } : {
      name: "",
      description: "",
      is_active: true
    },
  });

  async function onSubmit(values: GroupFormValues) {
    try {
      const supabase = createClient()
      // Preparar dados para envio
      const groupData = {
        ...values,
        updated_at: new Date().toISOString()
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from('stock_groups')
          .update(groupData)
          .eq('id', initialData.id)
          .select()
          .single();
        if (error) {
          toast.error('Erro ao salvar grupo: ' + error.message);
          console.error(error);
          return;
        }
        toast.success('Grupo atualizado com sucesso');
        onSuccess?.();
      } else {
        const { error } = await supabase
          .from('stock_groups')
          .insert(groupData)
          .select()
          .single();
        if (error) {
          toast.error('Erro ao criar grupo: ' + error.message);
          console.error(error);
          return;
        }
        toast.success('Grupo criado com sucesso');
        onSuccess?.();
      }
    } catch (error) {
      console.error("Erro ao salvar grupo:", error);
      toast.error("Erro ao salvar grupo");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField<GroupFormValues, "name">
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Grupo *</FormLabel>
              <FormControl>
                <Input placeholder="Nome do grupo de insumos" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField<GroupFormValues, "description">
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição breve do grupo (opcional)" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {initialData ? "Salvar Alterações" : "Criar Grupo"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
