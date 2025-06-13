"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { OrdemDeProducao, EtapaDeProducao } from '../producao.types';

interface KanbanProps {
  ordens: OrdemDeProducao[];
  etapas: EtapaDeProducao[];
  loading: boolean;
}

export function ProducaoKanban({ ordens, etapas, loading }: KanbanProps): React.ReactElement {
  if (loading) {
    return (
      <p className="text-muted-foreground text-center py-10">Carregando ordens...</p>
    );
  }

  if (etapas.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-10">Nenhuma etapa encontrada.</p>
    );
  }

  const byEtapa = etapas.reduce<Record<string, OrdemDeProducao[]>>((acc, et) => {
    acc[et.id] = ordens.filter((o) => o.current_stage_id === et.id);
    return acc;
  }, {});

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {etapas.map((etapa) => (
        <div key={etapa.id} className="min-w-[250px] w-[250px] flex-shrink-0">
          <Card className="h-full bg-muted/50">
            <CardHeader className="p-3 border-b mb-2">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                <span>{etapa.name}</span>
                <Badge variant="secondary">{byEtapa[etapa.id]?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3 overflow-y-auto max-h-[60vh]">
              {byEtapa[etapa.id] && byEtapa[etapa.id].length > 0 ? (
                byEtapa[etapa.id].map((op) => (
                  <Card key={op.id} className="shadow-sm">
                    <CardContent className="p-3 space-y-1">
                      <p className="text-sm font-medium">
                        {op.order?.client?.name ?? 'Pedido Interno'}
                      </p>
                      {op.order?.order_number && (
                        <p className="text-xs text-muted-foreground">#{op.order.order_number}</p>
                      )}
                      <p className="text-xs font-semibold text-primary">
                        {op.production_order_number}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">Nenhuma OP.</p>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default ProducaoKanban;
