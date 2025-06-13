"use client";

import React from 'react';
import type { HistoricoProducao } from '../rh.types';

interface HistoricoProdutividadeProps {
  historico: HistoricoProducao[];
}

export function HistoricoProdutividade({ historico }: HistoricoProdutividadeProps): React.ReactElement {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left">
          <th>OP</th>
          <th>Etapa</th>
          <th>Início</th>
          <th>Fim</th>
        </tr>
      </thead>
      <tbody>
        {historico.map((h) => (
          <tr key={h.id} className="border-b last:border-none">
            <td>{h.order?.production_order_number || '-'}</td>
            <td>{h.stage?.name || '-'}</td>
            <td>{new Date(h.start_date).toLocaleString('pt-BR')}</td>
            <td>{h.end_date ? new Date(h.end_date).toLocaleString('pt-BR') : '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
