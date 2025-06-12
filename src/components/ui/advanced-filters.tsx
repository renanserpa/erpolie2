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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Define Zod schema para validação do formulário de filtros avançados
const filterFormSchema = z.object({
  name: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().optional(),
  is_active: z.string().optional(),
  created_after: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterFormSchema>;

export type FilterOption = {
  id: string;
  label: string;
  type: "text" | "select" | "date" | "boolean";
  options?: { value: string; label: string }[];
};

interface AdvancedFiltersProps {
  filterOptions: FilterOption[];
  onFilterChange: (filters: { [key: string]: string }) => void;
  columnOptions?: { id: string; label: string }[];
  visibleColumns?: string[];
  onVisibleColumnsChange?: (cols: string[]) => void;
}

export function AdvancedFilters({ filterOptions, onFilterChange, columnOptions = [], visibleColumns = [], onVisibleColumnsChange }: AdvancedFiltersProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {},
  });

  function onSubmit(values: FilterFormValues) {
    // Remover valores vazios
    const cleanedValues: { [key: string]: string } = {};
    Object.entries(values).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        cleanedValues[key] = value;
      }
    });
    
    onFilterChange(cleanedValues);
    toast.success("Filtros aplicados");
  }

  function handleClearFilters() {
    form.reset();
    onFilterChange({});
    toast.success("Filtros limpos");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterOptions.map((option) => (
            <FormField
              key={option.id}
              control={form.control}
              name={option.id as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{option.label}</FormLabel>
                  {option.type === "text" && (
                    <FormControl>
                      <Input
                        placeholder={`Filtrar por ${option.label.toLowerCase()}`}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                  )}
                  {option.type === "select" && option.options && (
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Selecione ${option.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos</SelectItem>
                          {option.options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  )}
                  {option.type === "date" && (
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                  )}
                  {option.type === "boolean" && (
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Sim</SelectItem>
                          <SelectItem value="false">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
      ))}
        </div>
        {columnOptions.length > 0 && (
          <div className="mt-4 space-y-2">
            <FormLabel>Colunas Visíveis</FormLabel>
            {columnOptions.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(opt.id)}
                  onChange={(e) => {
                    if (!onVisibleColumnsChange) return;
                    const updated = e.target.checked
                      ? [...visibleColumns, opt.id]
                      : visibleColumns.filter((c) => c !== opt.id);
                    onVisibleColumnsChange(updated);
                  }}
                />
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClearFilters}
          >
            Limpar Filtros
          </Button>
          <Button type="submit">Aplicar Filtros</Button>
        </div>
      </form>
    </Form>
  );
}
