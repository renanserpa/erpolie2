"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Order } from './columns';

export interface Status {
  id: string;
  name: string;
  color?: string | null;
}

interface KanbanProps {
  orders: Order[];
  statuses: Status[];
  loading: boolean;
}

const formatDate = (date?: string | null) => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('pt-BR');
  } catch {
    return '';
  }
};

export function OrderKanbanBoard({ orders, statuses, loading }: KanbanProps) {
  if (loading) {
    return <p className="text-muted-foreground text-center py-10">Carregando pedidos...</p>;
  }

  if (statuses.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-10">Nenhum status encontrado para exibir o Kanban.</p>
    );
  }

  const byStatus = statuses.reduce<Record<string, Order[]>>((acc, st) => {
    acc[st.id] = orders.filter(o => o.status_id === st.id);
    return acc;
  }, {});

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statuses.map((status) => (
        <div key={status.id} className="min-w-[250px] w-[250px] flex-shrink-0">
          <Card className="h-full bg-muted/50">
            <CardHeader className="p-3 border-b mb-2">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                <span>{status.name}</span>
                <Badge variant="secondary">{byStatus[status.id]?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3 overflow-y-auto max-h-[60vh]">
              {byStatus[status.id] && byStatus[status.id].length > 0 ? (
                byStatus[status.id].map((order) => (
                  <Card key={order.id} className="shadow-sm">
                    <CardContent className="p-3 space-y-1">
                      <p className="text-sm font-medium">{order.client?.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.date)}</p>
                      <p className="text-xs font-semibold text-primary">#{order.id.substring(0,8)}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">Nenhum pedido.</p>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
