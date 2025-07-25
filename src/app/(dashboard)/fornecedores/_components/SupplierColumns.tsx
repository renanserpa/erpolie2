"use client";

import React from "react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Supplier } from "@/types/schema";

// Função auxiliar para exclusão
const handleDeleteSupplier = async (
  supplierId: string,
  supplierName: string,
  onDelete: (id: string, name: string) => void
) => {
  onDelete(supplierId, supplierName);
};

// Componente para renderizar ações na tabela
function SupplierActionsCell({
  row,
  onEdit,
  onDelete,
}: {
  row: Row<Supplier>;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string, supplierName: string) => void;
}) {
  const supplier = row.original as Supplier;
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(supplier.id)}>
          Copiar ID Fornecedor
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(supplier)}>
          <Edit className="mr-2 h-4 w-4" /> Editar Fornecedor
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/fornecedores/${supplier.id}`)}>
          <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-700 focus:bg-red-100/50"
          onClick={() => handleDeleteSupplier(supplier.id, supplier.name, onDelete)}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Excluir Fornecedor
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const supplierColumns = (
  onEdit: (supplier: Supplier) => void,
  onDelete: (supplierId: string, supplierName: string) => void
): ColumnDef<Supplier>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todas as linhas"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Razão Social
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link
        href={`/fornecedores/${row.original.id}`}
        className="font-medium text-blue-600 hover:underline"
      >
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "fantasy_name",
    header: "Nome Fantasia",
    cell: ({ row }) => <div>{row.original.fantasy_name || "-"}</div>,
  },
  {
    accessorKey: "document",
    header: "CNPJ",
    cell: ({ row }) => <div>{row.original.document || "-"}</div>,
  },
  {
    accessorKey: "city",
    header: "Cidade",
    cell: ({ row }) => <div>{row.original.city || "-"}</div>,
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => <div>{row.original.state || "-"}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.original.email || "-"}</div>,
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }) => <div>{row.original.phone || "-"}</div>,
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.is_active !== false;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Ativo" : "Inativo"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const isActive = row.getValue(id) !== false;
      return (
        (value.includes("Ativo") && isActive) ||
        (value.includes("Inativo") && !isActive)
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <SupplierActionsCell row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];

// Export para compatibilidade
export const columns = supplierColumns;
