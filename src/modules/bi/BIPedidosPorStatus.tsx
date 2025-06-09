"use client";
import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface PedidoStatusData {
  status: string;
  quantidade: number;
}

interface Props {
  data: PedidoStatusData[];
}

export function BIPedidosPorStatus({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="quantidade" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
