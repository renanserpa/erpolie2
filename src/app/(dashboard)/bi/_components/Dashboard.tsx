"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { DateRange } from 'react-day-picker';
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Truck, Users } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ReportExporter } from "../../financeiro/_components/ReportExporter";

// Tipagem dos dados
interface DashboardProps { className?: string }
interface KpiData {
  totalRevenue: number; totalExpenses: number; totalOrders: number; totalProducts: number;
  totalDeliveries: number; totalCustomers: number; revenueChange: number; ordersChange: number;
}
interface ChartData {
  salesByCategory: Array<{name: string; value: number}>;
  salesByMonth: Array<{name: string; receitas: number; despesas: number}>;
  topProducts: Array<{name: string; value: number}>;
  deliveryStatus: Array<{name: string; value: number}>;
  salesByDivision: Array<{name: string; value: number}>;
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
  const [divisions, setDivisions] = useState<Array<{id: string; name: string}>>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // --- FUNÇÕES DE FETCH (COLE SUAS LÓGICAS COMPLETAS AQUI) ---
  const fetchKpiData = useCallback(async (fromDate: string, toDate: string, divisionId: string | null): Promise<KpiData> => {
    // ...Sua lógica de KPI (já tipada, sem any)
    return {
      totalRevenue: 0, totalExpenses: 0, totalOrders: 0, totalProducts: 0,
      totalDeliveries: 0, totalCustomers: 0, revenueChange: 0, ordersChange: 0
    };
  }, []);

  const fetchChartData = useCallback(async (fromDate: string, toDate: string, divisionId: string | null): Promise<ChartData> => {
    // ...Sua lógica de gráficos (já tipada, sem any)
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
    } finally { setIsLoading(false); }
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

  // Formatadores
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatPercentage = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value / 100);
  const renderTrend = (value: number) => {
    if (value > 0) return (
      <div className="flex items-center text-green-500">
        <TrendingUp className="h-4 w-4 mr-1" />
        <span>{formatPercentage(value)}</span>
      </div>
    );
    if (value < 0) return (
      <div className="flex items-center text-red-500">
        <TrendingDown className="h-4 w-4 mr-1" />
        <span>{formatPercentage(Math.abs(value))}</span>
      </div>
    );
    return <div className="flex items-center text-gray-500"><span>0%</span></div>;
  };

  // JSX (cole abaixo o seu dashboard visual normalmente)
  return (
    <div className={`space-y-6 ${className ?? ''}`}>
      {/* Seu JSX do dashboard vai aqui */}
    </div>
  );
}
