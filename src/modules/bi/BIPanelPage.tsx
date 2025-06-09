"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { BIPedidosPorStatus } from "./BIPedidosPorStatus";
import { BIProducaoEtapas } from "./BIProducaoEtapas";
import { BIResumoFinanceiro } from "./BIResumoFinanceiro";
import { fetchPedidosPorStatus, fetchProducaoPorEtapa, fetchResumoFinanceiro } from "./BIService";

export default function BIPanelPage() {
  const [pedidosData, setPedidosData] = useState<{status: string; quantidade: number}[]>([]);
  const [producaoData, setProducaoData] = useState<{etapa: string; quantidade: number}[]>([]);
  const [financeiroData, setFinanceiroData] = useState<{receitas: number; despesas: number; saldo: number}>({receitas:0, despesas:0, saldo:0});

  const exportCSV = (data: object[], filename: string) => {
    if (data.length === 0) return;
    const csv = Papa.unparse(data);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  useEffect(() => {
    const loadData = async () => {
      const [pedidosRes, producaoRes, financeiroRes] = await Promise.all([
        fetchPedidosPorStatus(),
        fetchProducaoPorEtapa(),
        fetchResumoFinanceiro()
      ]);
      if (pedidosRes.success) setPedidosData(pedidosRes.data);
      if (producaoRes.success) setProducaoData(producaoRes.data);
      if (financeiroRes.success) setFinanceiroData(financeiroRes.data);
    };
    loadData();
  }, []);

  return (
    <Tabs defaultValue="vendas" className="space-y-6">
      <TabsList>
        <TabsTrigger value="vendas">Vendas</TabsTrigger>
        <TabsTrigger value="producao">Produção</TabsTrigger>
        <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
      </TabsList>
      <TabsContent value="vendas">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <BIPedidosPorStatus data={pedidosData} />
            <button className="mt-2 text-sm underline" onClick={() => exportCSV(pedidosData, 'pedidos_status')}>Exportar CSV</button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="producao">
        <Card>
          <CardHeader>
            <CardTitle>Produção por Etapa</CardTitle>
          </CardHeader>
          <CardContent>
            <BIProducaoEtapas data={producaoData} />
            <button className="mt-2 text-sm underline" onClick={() => exportCSV(producaoData, 'producao_etapas')}>Exportar CSV</button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="financeiro">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <BIResumoFinanceiro data={financeiroData} />
            <button className="mt-2 text-sm underline" onClick={() => exportCSV([financeiroData], 'resumo_financeiro')}>Exportar CSV</button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
