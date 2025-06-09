"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { colaboradorSchema, type ColaboradorFormValues } from '../rh.schema';
import { createColaborador, updateColaborador } from '../RHService';
import { toast } from 'sonner';

interface ColaboradorFormProps {
  initialData?: ColaboradorFormValues & { id?: string };
  onSuccess?: () => void;
}

export function ColaboradorForm({ initialData, onSuccess }: ColaboradorFormProps) {
  const form = useForm<ColaboradorFormValues>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: initialData || { name: '' },
  });

  async function onSubmit(values: ColaboradorFormValues) {
    const data = { ...values };
    const result = initialData?.id
      ? await updateColaborador(initialData.id, data)
      : await createColaborador(data);

    if (result.success) {
      toast.success('Colaborador salvo com sucesso');
      onSuccess?.();
    } else {
      toast.error(result.error || 'Erro ao salvar colaborador');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input placeholder="Nome do colaborador" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <FormControl>
                <Input placeholder="Cargo ou função" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {initialData ? 'Salvar Alterações' : 'Criar Colaborador'}
        </Button>
      </form>
    </Form>
  );
}
