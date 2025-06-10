"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, Upload } from "lucide-react"; // Add icons for import/export
import { DataTable } from "@/components/ui/data-table";
import { movementColumns, type StockMovement } from "./MovementColumns";
import { MovementForm } from "./MovementForm";
import { fetchMovimentacoes } from "@/modules/estoque/EstoqueService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

async function getMovements(): Promise<StockMovement[]> {
  const result = await fetchMovimentacoes();
  if (result.success) {
    return result.data || [];
  }
  console.warn('Nenhuma movimentação encontrada');
  return [];
}

export function MovementsPageClient() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [movements, setMovements] = React.useState<StockMovement[]>([]);
  // Editing movements is generally not recommended, focus on creation and viewing

  const fetchAndSetMovements = () => {
    getMovements().then(setMovements);
  };

  React.useEffect(() => {
    fetchAndSetMovements();
  }, []);

  const handleSuccess = () => {
    setIsFormOpen(false);
    fetchAndSetMovements();
    // TODO: Add toast notification for success
  };

  // Placeholder functions for import/export
  const handleExport = () => {
    alert("Exportar CSV (placeholder)");
    // TODO: Implement CSV export logic
  };
  const handleImport = () => {
    alert("Importar CSV (placeholder)");
    // TODO: Implement CSV import logic (likely needs a dedicated modal/page)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Histórico de Movimentações de Estoque</h1>
        <div className="flex items-center gap-2">
          {/* Import/Export Buttons (Placeholders) */}
          <Button variant="outline" onClick={handleImport} disabled>
            <Upload className="mr-2 h-4 w-4" /> Importar
          </Button>
          <Button variant="outline" onClick={handleExport} disabled>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          {/* Movement Form Trigger */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Registrar Movimentação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Registrar Nova Movimentação</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes da movimentação abaixo.
                </DialogDescription>
              </DialogHeader>
              <MovementForm onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Placeholder for filters */}
      <div>
        <p className="text-muted-foreground">Filtros por item, tipo, data, localização, usuário, etc. aqui...</p>
      </div>

      {/* DataTable for Movements */}
      <DataTable columns={movementColumns} data={movements} searchKey="item_name" />

    </div>
  );
}

