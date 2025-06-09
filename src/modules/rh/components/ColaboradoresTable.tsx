"use client";

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type ColaboradorRow = {
  id: string;
  name: string;
  role?: string;
  hire_date?: string;
  is_active: boolean;
};

export const colaboradorColumns: ColumnDef<ColaboradorRow>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Função',
  },
  {
    accessorKey: 'hire_date',
    header: 'Admissão',
    cell: ({ row }) => row.original.hire_date ? new Date(row.original.hire_date).toLocaleDateString('pt-BR') : '-',
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
        {row.original.is_active ? 'Ativo' : 'Inativo'}
      </Badge>
    ),
  },
];
