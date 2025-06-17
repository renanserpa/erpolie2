"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client"; // Corrigido aqui
import { ArrowLeft, Edit, Trash2, Package, AlertTriangle, Truck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Supply {
  id: string;
  name: string;
  description: string;
  unit_of_measurement_id: string;
  unit_of_measurement: {
    name: string;
    abbreviation: string;
  };
  cost: number;
  current_stock: number;
  min_stock: number;
  supplier_id: string;
  supplier: {
    name: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Component {
  id: string;
  component_id: string;
  component_name: string;
  quantity: number;
}

interface StockMovement {
  id: string;
  quantity: number;
  movement_type: string;
  reference_type: string;
  notes: string;
  created_at: string;
}

export default function SupplyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [supply, setSupply] = useState<Supply | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("details");

  useEffect(() => {
    const fetchSupplyDetails = async () => {
      setLoading(true);
      try {
        const { data: supplyData, error: supplyError } = await supabase
          .from("supplies")
          .select(`
            *,
            unit_of_measurement:unit_of_measurement_id (name, abbreviation),
            supplier:supplier_id (name)
          `)
          .eq("id", params.id)
          .single();

        if (supplyError) throw supplyError;
        setSupply(supplyData);

        const { data: componentsData, error: componentsError } = await supabase
          .from("componente_insumo")
          .select(`
            id,
            component_id,
            components:component_id (name),
            quantity
          `)
          .eq("supply_id", params.id);

        if (!componentsError && componentsData) {
          setComponents(componentsData.map(item => ({
            id: item.id,
            component_id: item.component_id,
            component_name: item.components?.name || "Componente desconhecido",
            quantity: item.quantity
          })));
        }

        const { data: movementsData, error: movementsError } = await supabase
          .from("stock_movements")
          .select("*")
          .eq("product_id", params.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (!movementsError) {
          setStockMovements(movementsData || []);
        }
      } catch (error: unknown) {
        console.error("Erro ao buscar detalhes do insumo:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSupplyDetails();
    }
  }, [params.id, supabase]);

  if (!params?.id) return null;

  const handleEdit = () => {
    alert("Funcionalidade de edição será implementada em breve");
  };

  const handleDelete = async () => {
    if (!supply) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o insumo ${supply.name}?`)) {
      try {
        const { error } = await supabase
          .from("supplies")
          .delete()
          .eq("id", supply.id);
          
        if (error) throw error;
        
        router.push("/insumos");
      } catch (error: unknown) {
        console.error("Erro ao excluir insumo:", error);
        alert("Não foi possível excluir o insumo. Verifique se não há registros relacionados.");
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getStockStatus = () => {
    if (!supply) return { text: "Desconhecido", class: "bg-gray-100 text-gray-800" };
    
    if (supply.current_stock === 0) {
      return { text: "Sem estoque", class: "bg-red-100 text-red-800" };
    } else if (supply.current_stock < supply.min_stock) {
      return { text: "Estoque baixo", class: "bg-yellow-100 text-yellow-800" };
    } else {
      return { text: "Estoque normal", class: "bg-green-100 text-green-800" };
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'entrada':
        return 'bg-green-100 text-green-800';
      case 'saída':
      case 'saida':
        return 'bg-red-100 text-red-800';
      case 'ajuste':
        return 'bg-blue-100 text-blue-800';
      case 'transferência':
      case 'transferencia':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando detalhes do insumo...</p>
      </div>
    );
  }

  if (!supply) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p>Insumo não encontrado</p>
        <Button onClick={handleBack} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const stockStatus = getStockStatus();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Detalhes do Insumo</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="stock">Estoque</TabsTrigger>
          <TabsTrigger value="components">Componentes</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* Conteúdo das abas */}
        {/* ... todas as TabsContent do seu código permanecem iguais ... */}

        <TabsContent value="details" className="space-y-4">
          {/* ... */}
        </TabsContent>

        <TabsContent value="stock">
          {/* ... */}
        </TabsContent>

        <TabsContent value="components">
          {/* ... */}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Atividades</CardTitle>
              <CardDescription>
                Registro de alterações e atividades relacionadas a este insumo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4 text-muted-foreground">
                Histórico de atividades será implementado em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
