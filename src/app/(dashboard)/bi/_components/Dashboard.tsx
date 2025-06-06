"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TrendingUp, TrendingDown } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

interface DashboardProps { className?: string }
interface KpiData {
  totalRevenue: number; totalExpenses: number; totalOrders: number; totalProducts: number;
  totalDeliveries: number; totalCustomers: number; revenueChange: number; ordersChange: number;
}
interface ChartData {
  salesByCategory: Array<{ name: string; value: number }>;
  salesByMonth: Array<{ name: string; receitas: number; despesas: number }>;
  topProducts: Array<{ name: string; value: number }>;
  deliveryStatus: Array<{ name: string; value: number }>;
  salesByDivision: Array<{ name: string; value: number }>;
}

export function Dashboard({ className }: DashboardProps) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [kpiData, setKpiData] = useState<KpiData>({
    totalRevenue: 0, totalExpenses: 0, totalOrders: 0, totalProducts: 0,
    totalDeliveries: 0, totalCustomers: 0, revenueChange: 0, ordersChange: 0
  });
  const [chartData, setChartData] = useState<ChartData>({
    salesByCategory: [], salesByMonth: [], topProducts: [], deliveryStatus: [], salesByDivision: []
  });
  const [divisions, setDivisions] = useState<Array<{ id: string; name: string }>>([]);

  // --- Fetch Functions (personalize conforme sua lógica real) ---
  const fetchKpiData = useCallback(async (fromDate: string, toDate: string, divisionId: string | null): Promise<KpiData> => {
    // ...implemente a lógica real aqui conforme seu banco
    return {
      totalRevenue: 0, totalExpenses: 0, totalOrders: 0, totalProducts: 0,
      totalDeliveries: 0, totalCustomers: 0, revenueChange: 0, ordersChange: 0
    };
  }, []);

  const fetchChartData = useCallback(async (fromDate: string, toDate: string, divisionId: string | null): Promise<ChartData> => {
    // ...implemente a lógica real aqui conforme seu banco
    return {
      salesByCategory: [], salesByMonth: [], topProducts: [], deliveryStatus: [], salesByDivision: []
    };
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fromDate = format(dateRange.from, "yyyy-MM-dd");
      const toDate = format(dateRange.to, "yyyy-MM-dd");
      const divisionId = divisionFilter !== "all" ? divisionFilter : null;
      const kpis = await fetchKpiData(fromDate, toDate, divisionId);
      setKpiData(kpis);
      const charts = await fetchChartData(fromDate, toDate, divisionId);
      setChartData(charts);
      toast.success("Dashboard atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      if (error instanceof Error) toast.error(`Erro ao carregar dashboard: ${error.message}`);
      else toast.error("Erro desconhecido ao carregar dashboard");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, divisionFilter, fetchKpiData, fetchChartData]);

  const fetchInitialData = useCallback(async () => {
    try {
      const { data: divisionsData, error: divisionsError } = await supabase
        .from("divisions")
        .select("id, name")
        .order("name");
      if (divisionsError) throw divisionsError;
      setDivisions(divisionsData || []);
      await fetchDashboardData();
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error);
      if (error instanceof Error) toast.error(`Erro ao carregar dados: ${error.message}`);
      else toast.error("Erro desconhecido ao carregar dados");
    }
  }, [fetchDashboardData, supabase]);

  useEffect(() => {
    fetchInitialData();
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchDashboardData, fetchInitialData]);

  // Filtros
  const handleDateChange = (range: DateRange) => {
    if (range?.from && range?.to) setDateRange({ from: range.from, to: range.to });
  };
  const handleApplyFilters = () => { fetchDashboardData(); };
  const handleResetFilters = () => {
    setDateRange({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) });
    setDivisionFilter("all");
    setTimeout(() => { fetchDashboardData(); }, 0);
  };
  const handlePredefinedPeriod = (period: string) => {
    const today = new Date();
    let from: Date, to: Date;
    switch (period) {
      case "today": from = today; to = today; break;
      case "yesterday": from = subDays(today, 1); to = subDays(today, 1); break;
      case "last7days": from = subDays(today, 6); to = today; break;
      case "last30days": from = subDays(today, 29); to = today; break;
      case "thisMonth": from = startOfMonth(today); to = today; break;
      default: from = startOfMonth(today); to = endOfMonth(today);
    }
    setDateRange({ from, to });
    setTimeout(() => { fetchDashboardData(); }, 0);
  };

  // Helpers
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatPercentage = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value / 100);

  const renderTrend = (value: number) => {
    if (value > 0)
      return <div className="flex items-center text-green-500"><TrendingUp className="h-4 w-4 mr-1" /> <span>{formatPercentage(value)}</span></div>;
    if (value < 0)
      return <div className="flex items-center text-red-500"><TrendingDown className="h-4 w-4 mr-1" /> <span>{formatPercentage(Math.abs(value))}</span></div>;
    return <div className="flex items-center text-gray-500"><span>0%</span></div>;
  };

  return (
    <div className={`space-y-6 ${className ?? ''}`}>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <DateRangePicker
            date={dateRange}
            onDateChange={handleDateChange}
            className="w-full md:w-auto"
          />
          <Select value={divisionFilter} onValueChange={setDivisionFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Todas as divisões" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as divisões</SelectItem>
              {divisions.map((division) => (
                <SelectItem key={division.id} value={division.id}>{division.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleApplyFilters}>Aplicar</Button>
          <Button variant="outline" onClick={handleResetFilters}>Resetar</Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => handlePredefinedPeriod("today")}>Hoje</Button>
        <Button variant="outline" size="sm" onClick={() => handlePredefinedPeriod("yesterday")}>Ontem</Button>
        <Button variant="outline" size="sm" onClick={() => handlePredefinedPeriod("last7days")}>Últimos 7 dias</Button>
        <Button variant="outline" size="sm" onClick={() => handlePredefinedPeriod("last30days")}>Últimos 30 dias</Button>
        <Button variant="outline" size="sm" onClick={() => handlePredefinedPeriod("thisMonth")}>Este mês</Button>
      </div>
      {/* Exemplo de uso dos helpers em cards/KPIs: */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Receitas</CardTitle>
            <CardDescription>Entradas no período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpiData.totalRevenue)}</div>
            <div>Variação: {renderTrend(kpiData.revenueChange)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total de Despesas</CardTitle>
            <CardDescription>Saídas no período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpiData.totalExpenses)}</div>
            <div>Pedidos: {kpiData.totalOrders} ({renderTrend(kpiData.ordersChange)})</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total de Clientes</CardTitle>
            <CardDescription>Clientes ativos cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalCustomers}</div>
          </CardContent>
        </Card>
      </div>
      {/* Implemente gráficos e outras visualizações conforme necessário */}
    </div>
  );
}
