"use client";
import React from 'react';
import { Pie, PieChart, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';

export interface ProducaoEtapaData {
  etapa: string;
  quantidade: number;
}

interface Props {
  data: ProducaoEtapaData[];
}

const COLORS = ['#0088FE', '#FFBB28', '#FF8042', '#A5854E', '#8884d8'];

export function BIProducaoEtapas({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="quantidade" nameKey="etapa" outerRadius={120} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
