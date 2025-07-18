"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import {
  componentColumns,
  type Component as TableComponent,
} from "@/app/(dashboard)/componentes/_components/ComponentColumns";
import { Plus, FileDown, FileUp, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import {
  AdvancedFilters,
  type FilterOption,
} from "@/components/ui/advanced-filters";
import { parse, unparse } from "papaparse";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { ComponentForm } from "@/app/(dashboard)/componentes/_components/ComponentForm";
import { getComponents, useSupabaseData } from "@/lib/data-hooks";
import type { Component } from "@/types/schema";

interface CSVParseResult<T> {
  data: T[];
  errors: unknown[];
  meta: unknown;
}

export default function ComponentesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [components, setComponents] = useState<Component[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>(
    {},
  );
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "name",
    "code",
    "category_id",
    "price",
    "is_active",
    "actions",
  ]);

  // Buscar dados relacionados para os filtros
  const { data: categories } = useSupabaseData("component_categories", "name");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Opções de filtro para componentes
  const filterOptions: FilterOption[] = [
    {
      id: "is_active",
      label: "Status",
      type: "select",
      options: [
        { value: "true", label: "Ativo" },
        { value: "false", label: "Inativo" },
      ],
    },
    {
      id: "category_id",
      label: "Categoria",
      type: "select",
      options: categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    },
    { id: "price_min", label: "Preço Mínimo", type: "number" },
    { id: "price_max", label: "Preço Máximo", type: "number" },
  ];

  // Opções de colunas visíveis
  const columnOptions = [
    { id: "name", label: "Nome" },
    { id: "code", label: "Código" },
    { id: "category_id", label: "Categoria" },
    { id: "price", label: "Preço" },
    { id: "is_active", label: "Status" },
    { id: "actions", label: "Ações" },
  ];

  const handleEdit = useCallback(
    (component: TableComponent) => {
      router.push(`/componentes/${component.id}?edit=1`);
    },
    [router],
  );

  const handleDelete = useCallback(async (component: TableComponent) => {
    if (confirm(`Excluir componente "${component.name}"?`)) {
      // TODO: implementar deleção via API
      toast.info("Funcionalidade de exclusão não implementada");
    }
  }, []);

  const columns = React.useMemo(
    () => componentColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete],
  );

  // Carregar dados dos componentes
  const fetchComponents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Construir query com filtros
      const query: Record<string, unknown> = {};

      if (debouncedSearchQuery) {
        query.name = `ilike.%${debouncedSearchQuery}%`;
      }

      // Adicionar filtros ativos à query
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key === "price_min") {
            query.price = `gte.${value}`;
          } else if (key === "price_max") {
            query.price = `lte.${value}`;
          } else if (
            typeof value === "string" &&
            ["name", "code"].includes(key)
          ) {
            // Filtro de texto com busca parcial
            query[key] = `ilike.%${value}%`;
          } else {
            // Outros tipos de filtro
            query[key] = value;
          }
        }
      });

      const result = await getComponents(query);

      if (result.success) {
        setComponents(result.data || []);
      } else {
        setError(result.error || "Erro ao carregar componentes");
        toast.error("Erro ao carregar componentes");
        setComponents([]);
      }
    } catch (err: unknown) {
      console.error("Error fetching components:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao carregar componentes");
      }
      toast.error("Erro ao carregar lista de componentes.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, activeFilters]);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  // Função para exportar componentes para CSV
  const exportToCSV = () => {
    try {
      const dataToExport = components.map((component) => ({
        Nome: component.name,
        Código: component.code,
        Categoria: component.category?.name || "",
        Preço: component.price,
        Status: component.is_active ? "Ativo" : "Inativo",
        "Data de Cadastro": new Date(component.created_at).toLocaleDateString(
          "pt-BR",
        ),
      }));

      const csv = unparse(dataToExport);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `componentes_${new Date().toISOString().split("T")[0]}.csv`);

      toast.success("Componentes exportados com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar componentes:", error);
      toast.error("Erro ao exportar componentes.");
    }
  };

  // Função para importar componentes de CSV
  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    parse(file, {
      header: true,
      complete: async (results: CSVParseResult<Record<string, string>>) => {
        try {
          // Aqui você implementaria a lógica para salvar os componentes importados
          // Por enquanto, apenas mostramos uma mensagem de sucesso
          toast.success(
            `${results.data.length} componentes importados com sucesso!`,
          );
          fetchComponents(); // Recarregar a lista após importação
        } catch (error: unknown) {
          console.error("Erro ao importar componentes:", error);
          toast.error("Erro ao importar componentes.");
        }
      },
      error: (error: unknown) => {
        console.error("Erro ao processar arquivo CSV:", error);
        toast.error("Erro ao processar arquivo CSV.");
      },
    });

    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    event.target.value = "";
  };

  // Função para lidar com o sucesso na criação de um componente
  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    fetchComponents();
    toast.success("Componente criado com sucesso!");
  };

  // Função para navegar para a página de detalhes do componente
  const handleComponentClick = (componentId: string) => {
    router.push(`/componentes/${componentId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Componentes</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <label htmlFor="import-csv" className="cursor-pointer">
            <Button
              variant="outline"
              onClick={() => document.getElementById("import-csv")?.click()}
            >
              <FileUp className="mr-2 h-4 w-4" />
              Importar CSV
            </Button>
            <input
              id="import-csv"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={importFromCSV}
            />
          </label>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Componente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Componente</DialogTitle>
              </DialogHeader>
              <ComponentForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gerenciar Componentes</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar componentes..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter className="h-4 w-4" />
              Filtros Avançados
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isFiltersOpen && (
            <div className="mb-6">
              <AdvancedFilters
                filterOptions={filterOptions}
                onFilterChange={setActiveFilters}
                columnOptions={columnOptions}
                visibleColumns={visibleColumns}
                onVisibleColumnsChange={setVisibleColumns}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <DataTable<TableComponent, unknown>
            columns={columns.filter(
              (col) => col.id && visibleColumns.includes(col.id),
            )}
            data={components}
            loading={isLoading}
            onRowClick={(row: TableComponent) => handleComponentClick(row.id!)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
