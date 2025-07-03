"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
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
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import type { Component } from "@/types/schema";

// Define Zod schema para validação do formulário de componente
const componentFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  description: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

type ComponentFormValues = z.infer<typeof componentFormSchema>;

interface ComponentFormProps {
  initialData?: Partial<Component>; // Para edição
  onSuccess?: () => void; // Callback após submissão bem-sucedida
}

export function ComponentForm({ initialData, onSuccess }: ComponentFormProps) {
  const router = useRouter();
  const form = useForm<ComponentFormValues>({
    resolver: zodResolver(componentFormSchema) as Resolver<ComponentFormValues>,
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      is_active: initialData?.is_active !== false,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(values: ComponentFormValues) {
    setIsSubmitting(true);
    try {
      const supabase = await createClient()
      // Preparar dados para envio
      const componentData = {
        ...values,
        updated_at: new Date().toISOString(),
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from("components")
          .update(componentData)
          .eq("id", initialData.id)
          .select()
          .single();
        if (error) {
          console.error("Erro Supabase:", error, "Payload:", componentData);
          toast.error("Erro ao salvar componente: " + error.message);
          return;
        }
        toast.success("Componente atualizado com sucesso");
        onSuccess?.();
        router.push("/componentes");
      } else {
        const { error } = await supabase
          .from("components")
          .insert(componentData)
          .select()
          .single();
        if (error) {
          console.error("Erro Supabase:", error, "Payload:", componentData);
          toast.error("Erro ao salvar componente: " + error.message);
          return;
        }
        toast.success("Componente criado com sucesso");
        onSuccess?.();
        router.push("/componentes");
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      toast.error("Erro inesperado ao criar componente");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Componente *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome do componente"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição do componente"
                  {...field}
                  value={field.value || ""}
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Status do Componente
                </FormLabel>
                <FormDescription>
                  Componente está ativo e disponível para uso?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? "Salvar Alterações" : "Criar Componente"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
