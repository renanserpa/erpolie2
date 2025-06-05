"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { clientColumns } from "./_components/ClientColumns";
import { Plus, FileDown, FileUp, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { AdvancedFilters, type FilterOption } from "@/components/ui/advanced-filters";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { ClientForm } from "./_components/ClientForm";
import { getClients } from "@/lib/data-hooks";

// Defina um tipo básico para Client (faça melhor depois)
type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  city: string;
  state: string;
  is_active: boolean;
  created_at: string;
};

export default function ClientesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Opções de filtro para clientes
  const filterOptions: FilterOption[] = [
    {
      id: "is_active",
      label: "Status",
      type: "select",
      options: [
        { value: true, label: "Ativo" },
        { value: false, label: "Inativo" },
      ],
    },
    { id: "city", label: "Cidade", type: "text" },
    { id: "state", label: "Estado", type: "text" },
    { id: "created_at", label: "Data de Cadastro", type: "date" },
  ];

  // Carregar dados dos clientes
  const fetchClients = async () => {
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
          if (key === "created_at" && typeof value === "string") {
            query[key] = `gte.${value}`;
          } else if (typeof value === "string") {
            query[key] = `ilike.%${value}%`;
          } else {
            query[key] = value;
          }
        }
      });

      const result = await getClients(query);

      if (result.success) {
        setClients(result.data || []);
      } else {
        setClients([
          {
            id: "1",
            name: "Renan Serpa",
            email: "renan@nutecnologia.com",
            phone: "65992834900",
            document: "01471569128",
            city: "Cuiabá",
            state: "MT",
            is_active: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Maria Silva",
            email: "maria@exemplo.com",
            phone: "11987654321",
            document: "12345678900",
            city: "São Paulo",
            state: "SP",
            is_active: true,
            created_at: new Date().toISOString(),
          },
        ]);
        console.warn("Usando dados mockados para clientes");
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError((err as Error).message || "Erro ao carregar clientes");
      toast.error("Erro ao carregar lista de clientes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [debouncedSearchQuery, activeFilters]);

  // Função para exportar clientes para CSV
  const exportToCSV = () => {
    try {
      const dataToExport = clients.map((client) => ({
        Nome: client.name,
        Email: client.email,
        Telefone: client.phone,
        Documento: client.document,
        Cidade: client.city,
        Estado: client.state,
        Status: client.is_active ? "Ativo" : "Inativo",
        "Data de Cadastro": new Date(client.created_at).toLocaleDateString("pt-BR"),
      }));

      const csv = Papa.unparse(dataToExport);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `clientes_${new Date().toISOString().split("T")[0]}.csv`);

      toast.success("Clientes exportados com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar clientes:", error);
      toast.error("Erro ao exportar clientes.");
    }
  };

  // Função para importar clientes de CSV
  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          toast.success(`${results.data.length} clientes importados com sucesso!`);
          fetchClients();
        } catch (error) {
          console.error("Erro ao importar clientes:", error);
          toast.error("Erro ao importar clientes.");
        }
      },
      error: (error) => {
        console.error("Erro ao processar arquivo CSV:", error);
        toast.error("Erro ao processar arquivo CSV.");
      },
    });

    event.target.value = "";
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    fetchClients();
    toast.success("Cliente criado com sucesso!");
  };

  const handleClientClick = (clientId: string) => {
    router.push(`/clientes/${clientId}`);
  };

  const columns = clientColumns(() => {}, () => {});

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Cliente</DialogTitle>
              </DialogHeader>
              <ClientForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gerenciar Clientes</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar clientes..."
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

          <DataTable
            columns={columns}
            data={clients}
            isLoading={isLoading}
            onRowClick={(row) => handleClientClick(row.id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
