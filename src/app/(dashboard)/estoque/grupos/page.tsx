"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { groupColumns } from "./_components/GroupColumns"; // Import real columns
import type { GrupoDeInsumo } from "@/modules/estoque/estoque.types";
import { GroupForm } from "./_components/GroupForm"; // Import real form
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
// TODO: Import AlertDialog for delete confirmation

// Fetch real group data from Supabase (Placeholder)
async function getGroups(): Promise<GrupoDeInsumo[]> {
  console.log("Fetching stock groups...");
  // Example structure matching potential columns
  return [
    { id: 'uuid-group-1', name: 'Grupo Insumo A', description: 'Grupo para insumos do tipo A', created_at: new Date().toISOString() },
    { id: 'uuid-group-2', name: 'Grupo Insumo B', description: 'Grupo para insumos do tipo B', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'uuid-group-3', name: 'Grupo Embalagens', created_at: new Date(Date.now() - 172800000).toISOString() },
  ];
  /* Replace with actual Supabase fetch:
  const supabase = createSupabaseServerClientAlternative();
  const { data, error } = await supabase
    .from('stock_groups') // Assuming table name
    .select(`
      id,
      name,
      description,
      created_at
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching groups:", error);
    return [];
  }

  return data || [];
  */
}

// Placeholder delete function (replace with API call)
async function deleteGroupAPI(groupId: string): Promise<void> {
  console.log(`API Placeholder: Deleting group ${groupId}`);
  await new Promise(resolve => setTimeout(resolve, 500));
}

export default function GruposEstoquePage() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [groups, setGroups] = React.useState<GrupoDeInsumo[]>([]);
  const [editingGroup, setEditingGroup] = React.useState<GrupoDeInsumo | null>(null);

  const fetchAndSetGroups = () => {
    getGroups().then(setGroups);
  };

  React.useEffect(() => {
    fetchAndSetGroups();
  }, []);

  const handleSuccess = () => {
    setIsFormOpen(false);
    setEditingGroup(null);
    fetchAndSetGroups();
    toast.success("Grupo salvo com sucesso");
  };

  const handleEdit = React.useCallback((group: GrupoDeInsumo) => {
    setEditingGroup(group);
    setIsFormOpen(true);
  }, []);

  const handleDelete = React.useCallback(async (group: GrupoDeInsumo) => {
    const { id: groupId, name: groupName } = group;
    if (window.confirm(`Tem certeza que deseja excluir o grupo "${groupName}"? Esta ação pode afetar itens de estoque associados.`)) {
      try {
        await deleteGroupAPI(groupId);
        console.log(`Group ${groupId} deleted successfully.`);
        fetchAndSetGroups(); // Refresh data
        toast.success(`Grupo "${groupName}" excluído`);
      } catch (error) {
        console.error("Error deleting group:", error);
        toast.error(`Erro ao excluir grupo "${groupName}"`);
      }
    }
  }, []);

  // Memoize columns
  const columns = React.useMemo(() => groupColumns(handleEdit, handleDelete), [handleEdit, handleDelete]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Gestão de Grupos de Insumo/Estoque</h1>
        <div className="flex items-center gap-2">
          <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
            setIsFormOpen(isOpen);
            if (!isOpen) setEditingGroup(null); // Reset editing state on close
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingGroup(null)}> {/* Ensure editingGroup is null for new */}
                <PlusCircle className="mr-2 h-4 w-4" /> Novo Grupo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingGroup ? 'Editar Grupo' : 'Criar Novo Grupo'}</DialogTitle>
                <DialogDescription>
                  {editingGroup ? 'Atualize os detalhes do grupo abaixo.' : 'Preencha os detalhes do grupo abaixo.'}
                </DialogDescription>
              </DialogHeader>
              <GroupForm onSuccess={handleSuccess} initialData={editingGroup ?? undefined} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Placeholder for filters */}
      <div>
        <p className="text-muted-foreground">Filtros por nome, etc. aqui...</p>
      </div>

      {/* DataTable for Groups */}
      <DataTable columns={columns} data={groups} searchKey="name" />

    </div>
  );
}

