"use client";
import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ResumoFinanceiroProps {
  data: { receitas: number; despesas: number; saldo: number };
}

export function BIResumoFinanceiro({ data }: ResumoFinanceiroProps) {
  const chartData = [
    { name: 'Receitas', value: data.receitas },
    { name: 'Despesas', value: data.despesas },
    { name: 'Saldo', value: data.saldo }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#A5854E" />
      </BarChart>
    </ResponsiveContainer>
  );
}
