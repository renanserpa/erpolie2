"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusResumo {
  status: string;
  count: number;
}

export function ResumoLogistica() {
  const [dados, setDados] = useState<StatusResumo[]>([]);

  useEffect(() => {
    const supabase = createClient();
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('deliveries')
        .select('status:status_id (name)');

      if (!error && data) {
        const map: Record<string, number> = {};
        data.forEach((d) => {
          const name = (d as any).status?.name || 'Indefinido';
          map[name] = (map[name] || 0) + 1;
        });
        setDados(Object.entries(map).map(([status, count]) => ({ status, count })));
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo de Entregas</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {dados.map((d) => (
          <div key={d.status} className="flex justify-between">
            <span>{d.status}</span>
            <span className="font-medium">{d.count}</span>
          </div>
        ))}
        {dados.length === 0 && <p className="text-sm text-muted-foreground">Nenhum dado</p>}
      </CardContent>
    </Card>
  );
}
