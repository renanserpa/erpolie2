"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { orderColumns, type PurchaseOrder } from "@/app/(dashboard)/compras/_components/PurchaseOrderColumns";
import { PurchaseOrderForm } from "@/app/(dashboard)/compras/_components/PurchaseOrderForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchPurchaseOrders } from "./ComprasService";
import { toast } from "sonner";
import { Filter } from "lucide-react";
import { AdvancedFilters, type FilterOption } from "@/components/ui/advanced-filters";

export default function ComprasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});

  const debouncedSearch = useDebounce(searchQuery, 500);

  const filterOptions: FilterOption[] = [
    { id: "status_id", label: "Status", type: "text" },
    { id: "supplier_id", label: "Fornecedor", type: "text" },
    { id: "order_date", label: "Data", type: "date" },
  ];

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const query: Record<string, unknown> = {};
      if (debouncedSearch) {
        query.purchase_order_number = `ilike.%${debouncedSearch}%`;
      }
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          query[key] = value;
        }
      });
      const result = await fetchPurchaseOrders(query);
      if (result.success) {
        const mapped = (result.data || []).map(
          (po): PurchaseOrder => ({
            id: po.id,
            supplier_id: po.supplier_id,
            supplier_name: po.supplier?.name ?? undefined,
            date: po.order_date,
            status_id: po.status_id,
            status_name: po.status?.name ?? undefined,
            status_color: po.status?.color ?? undefined,
            delivery_date: po.expected_delivery_date || undefined,
            total_amount: po.total_amount,
            created_at: po.created_at,
          })
        );
        setOrders(mapped);
      } else {
        setOrders([]);
        setError(result.error || "Erro ao buscar pedidos de compra");
      }
    } catch (err) {
      const e = err as Error;
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, activeFilters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    loadData();
    toast.success("Pedido de compra criado com sucesso!");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pedidos de Compra</h1>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Novo Pedido</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px]">
              <DialogHeader>
                <DialogTitle>Criar Pedido de Compra</DialogTitle>
              </DialogHeader>
              <PurchaseOrderForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gerenciar Pedidos de Compra</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Input
              placeholder="Buscar pedidos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter className="h-4 w-4" /> Filtros
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
            <div className="mb-4 text-red-600 text-sm" data-testid="error-message">
              {error}
            </div>
          )}
          <DataTable columns={orderColumns} data={orders} loading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
