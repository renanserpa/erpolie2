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
interface DashboardProps {
  className?: string;
}

interface KpiData {
  totalRevenue: number;
  totalExpenses: number;
  totalOrders: number;
  totalProducts: number;
  totalDeliveries: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
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
    totalRevenue: 0,
    totalExpenses: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalDeliveries: 0,
    totalCustomers: 0,
    revenueChange: 0,
    ordersChange: 0
  });
  const [chartData, setChartData] = useState<ChartData>({
    salesByCategory: [],
    salesByMonth: [],
    topProducts: [],
    deliveryStatus: [],
    salesByDivision: []
  });
  const [divisions, setDivisions] = useState<Array<{id: string; name: string}>>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Cores
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const DIVISION_COLORS = {
    'Ateliê': '#F0FFBE',
    'Casa': '#A5854E',
    'Pet': '#6B7280',
    'Music': '#8B5CF6',
    'Wood': '#D97706',
    'Brand': '#10B981'
  };

  // --- FUNÇÕES DE FETCH ---
  // KPIs
  const fetchKpiData = useCallback(async (fromDate: string, toDate: string, divisionId: string | null): Promise<KpiData> => {
    // ... [mantenha sua função conforme está, só remova qualquer "any"] ...
    // ... [Já estava tipada corretamente] ...
    // ... [NÃO inclua supabase nas dependências do useCallback, pois é estático] ...
    // ... [Função já correta, igual no seu último envio] ...
    // [Função omitida aqui por espaço, mas pode usar igual ao seu código acima]
    // ...
    // -- Cole aqui o mesmo código de fetchKpiData --
    // ...
    // [Não esqueça de manter o try/catch e throw error;]
    // ...
  }, [supabase]);

  // Chart Data
  const fetchChartData = useCallback(async (fromDate: string, toDate: string, divisionId: string | null): Promise<ChartData> => {
    // ... [idem acima: pode colar sua lógica original, apenas não use "any" nunca!] ...
  }, [supabase]);

  // Dashboard Data (junta as duas)
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
      if (error instanceof Error) {
        toast.error(`Erro ao carregar dashboard: ${error.message}`);
      } else {
        toast.error("Erro desconhecido ao carregar dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  }, [dateRange.from, dateRange.to, divisionFilter, fetchKpiData, fetchChartData]);

  // Fetch inicial (carrega divisões e chama o dashboard)
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
      if (error instanceof Error) {
        toast.error(`Erro ao carregar dados: ${error.message}`);
      } else {
        toast.error("Erro desconhecido ao carregar dados");
      }
    }
  }, [fetchDashboardData, supabase]);

  // --- HOOKS ---
  useEffect(() => {
    fetchInitialData();
    // Atualização automática a cada 5 minutos
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchDashboardData, fetchInitialData]);

  // Filtro de datas
  const handleDateChange = (range: DateRange) => {
    if (range?.from && range?.to) setDateRange({ from: range.from, to: range.to });
  };

  // Filtros e períodos predefinidos (idênticos ao seu código)
  // ... [cole aqui suas funções de handleApplyFilters, handleResetFilters, handlePredefinedPeriod etc, já estavam corretas] ...
  // ... [apenas garanta sempre tipos explícitos, nunca "any"] ...

  // --- FORMATADORES ---
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

  // --- JSX ---
  return (
    <div className={`space-y-6 ${className ?? ''}`}>
      {/* ... [todo o JSX igual ao seu, sem "merge markers" nem tipos any] ... */}
      {/* ... [componentes já estavam corretos] ... */}
    </div>
  );
}
