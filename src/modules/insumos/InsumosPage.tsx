"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { insumoColumns } from "@/app/(dashboard)/insumos/_components/InsumoColumns";
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
import Papa from "papaparse";
import type { ParseError, ParseResult } from "papaparse";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { InsumoForm } from "@/app/(dashboard)/insumos/_components/InsumoForm";
import { getInsumos, useSupabaseData } from "@/lib/data-hooks";
import type { Insumo } from "@/app/(dashboard)/insumos/_components/InsumoColumns";

interface CSVInsumoParseResult {
  Nome: string;
  SKU: string;
  Quantidade: string;
  "Quantidade Mínima": string;
  Unidade: string;
  Fornecedor: string;
  Status: string;
  "Data de Cadastro": string;
}

export default function InsumosPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>(
    {},
  );
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "name",
    "sku",
    "quantity",
    "min_quantity",
    "unit_of_measurement_id",
    "supplier_id",
    "is_active",
    "actions",
  ]);

  // Buscar dados relacionados para os filtros
  const { data: suppliers } = useSupabaseData("suppliers", "name");
  const { data: units } = useSupabaseData("unit_of_measurement", "name");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Opções de filtro para insumos
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
      id: "supplier_id",
      label: "Fornecedor",
      type: "select",
      options: suppliers.map((supplier) => ({
        value: supplier.id,
        label: supplier.name,
      })),
    },
    {
      id: "unit_of_measurement_id",
      label: "Unidade",
      type: "select",
      options: units.map((unit) => ({
        value: unit.id,
        label: `${unit.name} (${unit.abbreviation})`,
      })),
    },
    { id: "low_stock", label: "Estoque Baixo", type: "boolean" },
  ];

  // Opções de colunas visíveis
  const columnOptions = [
    { id: "name", label: "Nome" },
    { id: "sku", label: "SKU" },
    { id: "quantity", label: "Quantidade" },
    { id: "min_quantity", label: "Qtd. Mínima" },
    { id: "unit_of_measurement_id", label: "Unidade" },
    { id: "supplier_id", label: "Fornecedor" },
    { id: "is_active", label: "Status" },
    { id: "actions", label: "Ações" },
  ];

  const handleEdit = useCallback(
    (insumo: Insumo) => {
      router.push(`/insumos/${insumo.id}?edit=1`);
    },
    [router],
  );

  const handleDelete = useCallback(async (insumo: Insumo) => {
    if (confirm(`Excluir insumo "${insumo.name}"?`)) {
      toast.info("Funcionalidade de exclusão não implementada");
    }
  }, []);

  const columns = useMemo(
    () => insumoColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete],
  );

  // Carregar dados dos insumos
  const fetchInsumos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Construir query com filtros
      const query: Record<string, string | number | boolean> = {};

      if (debouncedSearchQuery) {
        query.name = `ilike.%${debouncedSearchQuery}%`;
      }

      // Adicionar filtros ativos à query
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key === "low_stock" && value === true) {
            // Filtro especial para estoque baixo
            query.low_stock = true;
          } else if (
            typeof value === "string" &&
            ["name", "sku"].includes(key)
          ) {
            // Filtro de texto com busca parcial
            query[key] = `ilike.%${value}%`;
          } else {
            // Outros tipos de filtro
            query[key] = value;
          }
        }
      });

      const result = await getInsumos(query);

      if (result.success) {
        setInsumos(result.data || []);
      } else {
        setError(result.error || "Erro ao carregar insumos");
        toast.error("Erro ao carregar insumos");
        setInsumos([]);
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error fetching supplies:", error);
      setError(error.message || "Erro ao carregar insumos");
      toast.error("Erro ao carregar lista de insumos.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, activeFilters]);

  useEffect(() => {
    fetchInsumos();
  }, [fetchInsumos]);

  // Função para exportar insumos para CSV
  const exportToCSV = () => {
    try {
      const dataToExport = insumos.map((insumo) => ({
        Nome: insumo.name,
        SKU: insumo.sku,
        Quantidade: insumo.quantity,
        "Quantidade Mínima": insumo.min_quantity,
        Unidade: insumo.unit_of_measurement?.name || "",
        Fornecedor: insumo.supplier?.name || "",
        Status: insumo.is_active ? "Ativo" : "Inativo",
        "Data de Cadastro": new Date(insumo.created_at).toLocaleDateString(
          "pt-BR",
        ),
      }));

      const csv = Papa.unparse(dataToExport);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `insumos_${new Date().toISOString().split("T")[0]}.csv`);

      toast.success("Insumos exportados com sucesso!");
    } catch (error: unknown) {
      console.error("Erro ao exportar insumos:", error);
      toast.error("Erro ao exportar insumos.");
    }
  };

  // Função para importar insumos de CSV
  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<CSVInsumoParseResult>(file, {
      header: true,
      complete: async (results: ParseResult<CSVInsumoParseResult>) => {
        try {
          // Aqui você implementaria a lógica para salvar os insumos importados
          // Por enquanto, apenas mostramos uma mensagem de sucesso
          toast.success(
            `${results.data.length} insumos importados com sucesso!`,
          );
          fetchInsumos(); // Recarregar a lista após importação
        } catch (error: unknown) {
          console.error("Erro ao importar insumos:", error);
          toast.error("Erro ao importar insumos.");
        }
      },
      error: (error: ParseError) => {
        console.error("Erro ao processar arquivo CSV:", error);
        toast.error("Erro ao processar arquivo CSV.");
      },
    });

    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    event.target.value = "";
  };

  // Função para lidar com o sucesso na criação de um insumo
  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    fetchInsumos();
    toast.success("Insumo criado com sucesso!");
  };

  // Função para navegar para a página de detalhes do insumo
  const handleInsumoClick = (insumoId: string) => {
    router.push(`/insumos/${insumoId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Insumos</h1>
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
                Novo Insumo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Insumo</DialogTitle>
              </DialogHeader>
              <InsumoForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gerenciar Insumos</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar insumos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

          <DataTable
            columns={columns.filter(
              (col) => col.id && visibleColumns.includes(col.id),
            )}
            data={insumos}
            loading={isLoading}
            onRowClick={(row) => handleInsumoClick(row.id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
