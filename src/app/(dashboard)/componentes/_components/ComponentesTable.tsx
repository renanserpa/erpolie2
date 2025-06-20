"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useSupabaseData, createRecord, updateRecord, deleteRecord } from "@/lib/data-hooks";
import type { Component } from "@/types/schema";
import { Loader2, Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export default function ComponentesTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Component | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    stock_quantity: '',
    min_stock: '',
    supplier_id: ''
  });

  // Buscar dados de componentes
  const { data: componentes, loading, error, refresh } = useSupabaseData('components', 'name');
  
  // Buscar fornecedores para o select
  const { data: suppliers } = useSupabaseData('suppliers', 'name');

  // Filtrar componentes com base no termo de busca
  const filteredComponentes = componentes.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (item?: Component) => {
    if (item) {
      setCurrentItem(item);
      setFormData({
        name: item.name || '',
        description: item.description || '',
        cost: item.cost?.toString() || '',
        stock_quantity: item.stock_quantity?.toString() || '',
        min_stock: item.min_stock?.toString() || '',
        supplier_id: item.supplier_id || ''
      });
    } else {
      setCurrentItem(null);
      setFormData({
        name: '',
        description: '',
        cost: '',
        stock_quantity: '',
        min_stock: '',
        supplier_id: ''
      });
    }
    setIsOpen(true);
  };

  const handleOpenDeleteDialog = (item: Component) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Converter valores numéricos
      const numericData = {
        ...formData,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
        min_stock: formData.min_stock ? parseInt(formData.min_stock) : null
      };

      if (currentItem) {
        // Atualizar componente existente
        await updateRecord('components', currentItem.id, numericData);
      } else {
        // Criar novo componente
        await createRecord('components', numericData);
      }
      
      // Fechar diálogo e atualizar lista
      setIsOpen(false);
      refresh();
    } catch (error) {
      console.error("Erro ao salvar componente:", error);
      toast.error("Erro ao salvar componente");
    }
  };

  const handleDelete = async () => {
    if (!currentItem) return;
    
    try {
      await deleteRecord('components', currentItem.id);
      setIsDeleteDialogOpen(false);
      refresh();
    } catch (error) {
      console.error("Erro ao excluir componente:", error);
      toast.error("Erro ao excluir componente");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/15 p-4 rounded-md text-destructive">
        Erro ao carregar componentes: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar componentes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Componente
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Custo</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Estoque Mín.</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComponentes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum componente encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredComponentes.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>R$ {item.cost?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>{item.stock_quantity || 0}</TableCell>
                  <TableCell>{item.min_stock || 0}</TableCell>
                  <TableCell>
                    {suppliers.find(s => s.id === item.supplier_id)?.name || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de Criação/Edição */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentItem ? 'Editar Componente' : 'Novo Componente'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="supplier_id" className="text-sm font-medium">Fornecedor</label>
                <select
                  id="supplier_id"
                  name="supplier_id"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.supplier_id}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um fornecedor</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Descrição</label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="cost" className="text-sm font-medium">Custo (R$)</label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="stock_quantity" className="text-sm font-medium">Estoque</label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="min_stock" className="text-sm font-medium">Estoque Mínimo</label>
                <Input
                  id="min_stock"
                  name="min_stock"
                  type="number"
                  min="0"
                  value={formData.min_stock}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {currentItem ? 'Salvar Alterações' : 'Criar Componente'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Tem certeza que deseja excluir o componente &quot;{currentItem?.name}&quot;?</p>
            <p className="text-sm text-muted-foreground mt-2">Esta ação não pode ser desfeita.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
