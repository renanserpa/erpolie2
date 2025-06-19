import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Principal</h1>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Receita Total</h2>
          <p className="text-2xl font-bold">R$ 45.231,89</p>
          <p className="text-xs text-green-500">+12% vs mês passado</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Novos Clientes</h2>
          <p className="text-2xl font-bold">+24</p>
          <p className="text-xs text-green-500">+8% vs mês passado</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Pedidos Pendentes</h2>
          <p className="text-2xl font-bold">18</p>
          <p className="text-xs text-gray-500">Aguardando processamento</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Produção Ativa</h2>
          <p className="text-2xl font-bold">7</p>
          <p className="text-xs text-gray-500">Ordens em andamento</p>
        </div>
      </div>

      {/* Gráficos e Alertas */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Vendas Recentes</h2>
            <div className="h-64 flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Gráfico de Vendas (Demonstração)</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Atividade Recente</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <p className="text-sm">Novo pedido criado - Cliente: Maria Silva</p>
                <p className="text-xs text-gray-500 ml-auto">Há 2 horas</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <p className="text-sm">Produto atualizado - SKU: PROD001</p>
                <p className="text-xs text-gray-500 ml-auto">Há 3 horas</p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <p className="text-sm">Estoque baixo - Produto: Tecido Algodão</p>
                <p className="text-xs text-gray-500 ml-auto">Há 5 horas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Alertas de Estoque Baixo</h2>
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="font-medium">Tecido Algodão</p>
              <p className="text-sm text-gray-600">Estoque: 5 metros (Mínimo: 20)</p>
            </div>
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="font-medium">Linha Preta</p>
              <p className="text-sm text-gray-600">Estoque: 3 rolos (Mínimo: 10)</p>
            </div>
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="font-medium">Botões 15mm</p>
              <p className="text-sm text-gray-600">Estoque: 25 unidades (Mínimo: 100)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
