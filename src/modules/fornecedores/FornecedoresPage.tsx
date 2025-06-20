"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { supplierColumns } from "@/app/(dashboard)/fornecedores/_components/SupplierColumns";
import { Plus, FileDown, FileUp, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { AdvancedFilters, type FilterOption } from "@/components/ui/advanced-filters";
import Papa from "papaparse";

interface CSVParseResult<T> {
  data: T[];
}

interface CSVParseError {
  message: string;
}
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { SupplierForm } from "@/app/(dashboard)/fornecedores/_components/SupplierForm";
import type { Supplier } from "@/types/schema";
import { fetchFornecedores } from "./FornecedoresService";

export default function FornecedoresPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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
    { id: "city", label: "Cidade", type: "text" },
    { id: "state", label: "Estado", type: "text" },
    { id: "document", label: "CNPJ", type: "text" },
    { id: "created_at", label: "Data de Cadastro", type: "date" },
  ];

  const fetchSuppliers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const query: Record<string, unknown> = {};
      if (debouncedSearchQuery) {
        query.name = `ilike.%${debouncedSearchQuery}%`;
      }
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key === "created_at" && typeof value === "string") {
            query[key] = `gte.${value}`;
          } else if (typeof value === "string") {
            query[key] = `ilike.%${value}%`;
          } else {
            query[key] = value;
          }
        }
      });

      const result = await fetchFornecedores(query);

      if (result.success) {
        setSuppliers(result.data || []);
      } else {
        setSuppliers([]);
        setError("Erro ao buscar fornecedores do banco.");
        toast.error("Erro ao buscar fornecedores do banco.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar fornecedores");
      toast.error("Erro ao carregar lista de fornecedores.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, activeFilters]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const exportToCSV = () => {
    try {
      const dataToExport = suppliers.map((supplier) => ({
        "Razão Social": supplier.name,
        "Nome Fantasia": supplier.fantasy_name,
        "CNPJ": supplier.document,
        "Cidade": supplier.city,
        "Estado": supplier.state,
        "Email": supplier.email,
        "Telefone": supplier.phone,
        "Status": supplier.is_active ? "Ativo" : "Inativo",
        "Data de Cadastro": new Date(supplier.created_at).toLocaleDateString("pt-BR"),
      }));
      const csv = Papa.unparse(dataToExport);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `fornecedores_${new Date().toISOString().split("T")[0]}.csv`);
      toast.success("Fornecedores exportados com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar fornecedores:", error);
      toast.error("Erro ao exportar fornecedores.");
    }
  };

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results: CSVParseResult<Record<string, unknown>>) => {
        toast.success(`${results.data.length} fornecedores importados com sucesso!`);
        fetchSuppliers();
      },
      error: (error: CSVParseError) => {
        console.error("Erro ao processar arquivo CSV:", error);
        toast.error("Erro ao processar arquivo CSV.");
      },
    });
    event.target.value = "";
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    fetchSuppliers();
    toast.success("Fornecedor criado com sucesso!");
  };

  const handleEdit = useCallback((supplier: Supplier) => {
    router.push(`/fornecedores/${supplier.id}?edit=1`);
  }, [router]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (confirm(`Excluir fornecedor "${name}"?`)) {
      toast.info('Funcionalidade de exclusão não implementada');
    }
  }, []);

  const columns = useMemo(
    () => supplierColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Fornecedores</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <label htmlFor="import-csv" className="cursor-pointer">
            <Button variant="outline" onClick={() => document.getElementById("import-csv")?.click()}>
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Fornecedor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Fornecedor</DialogTitle>
              </DialogHeader>
              <SupplierForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gerenciar Fornecedores</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar fornecedores..."
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
              <AdvancedFilters filterOptions={filterOptions} onFilterChange={setActiveFilters} />
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
          <DataTable columns={columns} data={suppliers} loading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
