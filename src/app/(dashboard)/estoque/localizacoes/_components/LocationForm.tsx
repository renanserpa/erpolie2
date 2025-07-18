"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InputNumber } from "@/components/ui/input-number";
import { createClient } from "@/lib/supabase/client";
import { updateRecord } from "@/lib/data-hooks";
import { toast } from "sonner";
import type { LocalizacaoEstoque } from "@/modules/estoque/estoque.types";

// Define Zod schema para validação do formulário
const locationFormSchema = z.object({
  name: z.string().min(2, { message: "Nome da localização deve ter pelo menos 2 caracteres." }),
  description: z.string().optional(),
  capacity: z.number().nonnegative({ message: "Capacidade não pode ser negativa." }).optional(),
  is_active: z.boolean().default(true),
});

type LocationFormValues = z.infer<typeof locationFormSchema>;

interface LocationFormProps {
  initialData?: Partial<LocalizacaoEstoque>;
  onSuccess?: () => void;
}

export function LocationForm({ initialData, onSuccess }: LocationFormProps) {
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: initialData ? {
      name: initialData.name || "",
      description: initialData.description || "",
      capacity: initialData.capacity || 0,
      is_active: initialData.is_active !== false
    } : {
      name: "",
      description: "",
      capacity: 0,
      is_active: true
    },
  });

  async function onSubmit(values: LocationFormValues) {
    try {
      const supabase = createClient()
      // Preparar dados para envio
      const locationData = {
        ...values,
        updated_at: new Date().toISOString()
      };
      
      if (initialData?.id) {
        const { error } = await supabase
          .from('locations')
          .update(locationData)
          .eq('id', initialData.id)
          .select()
          .single();
        if (error) {
          toast.error('Erro ao salvar localização: ' + error.message);
          console.error(error);
          return;
        }
        toast.success('Localização atualizada com sucesso');
        onSuccess?.();
      } else {
        const { error } = await supabase
          .from('locations')
          .insert(locationData)
          .select()
          .single();
        if (error) {
          toast.error('Erro ao criar localização: ' + error.message);
          console.error(error);
          return;
        }
        toast.success('Localização criada com sucesso');
        onSuccess?.();
      }
    } catch (error) {
      console.error("Erro ao salvar localização:", error);
      toast.error("Erro ao salvar localização");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome */}
        <FormField<LocationFormValues, "name">
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Localização *</FormLabel>
              <FormControl>
                <Input placeholder="Nome da localização" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField<LocationFormValues, "description">
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição da localização (opcional)" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Capacidade */}
        <FormField<LocationFormValues, "capacity">
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidade</FormLabel>
              <FormControl>
                <InputNumber 
                  allowNegative={false} 
                  placeholder="0" 
                  value={field.value || 0}
                  onChange={(value) => field.onChange(value)}
                />
              </FormControl>
              <FormDescription>Capacidade máxima de armazenamento (opcional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {initialData ? "Salvar Alterações" : "Criar Localização"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
