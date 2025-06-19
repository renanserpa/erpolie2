-- Habilitar RLS e criar policy de INSERT para todas as tabelas principais

-- Tabela: clientes
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir insert se autenticado"
  ON clientes
  FOR INSERT
  USING (auth.uid() IS NOT NULL);

-- Tabela: produtos
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir insert se autenticado"
  ON produtos
  FOR INSERT
  USING (auth.uid() IS NOT NULL);

-- Tabela: fornecedores
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir insert se autenticado"
  ON fornecedores
  FOR INSERT
  USING (auth.uid() IS NOT NULL);

-- Tabela: pedidos
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir insert se autenticado"
  ON pedidos
  FOR INSERT
  USING (auth.uid() IS NOT NULL);

-- Tabela: compras
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir insert se autenticado"
  ON compras
  FOR INSERT
  USING (auth.uid() IS NOT NULL);

-- Tabela: kits
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir insert se autenticado"
  ON kits
  FOR INSERT
  USING (auth.uid() IS NOT NULL);

-- Tabela: componentes
ALTER TABLE componentes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir insert se autenticado"
  ON componentes
  FOR INSERT
  USING (auth.uid() IS NOT NULL);

-- Tabela: insumos
ALTER TABLE insumos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir insert se autenticado"
  ON insumos
  FOR INSERT
  USING (auth.uid() IS NOT NULL);

-- Tabela: movimentacoes_estoque
ALTER TABLE movimentacoes_estoque ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir insert se autenticado"
  ON movimentacoes_estoque
  FOR INSERT
  USING (auth.uid() IS NOT NULL);

-- Tabela: ordens_producao
ALTER TABLE ordens_producao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir insert se autenticado"
  ON ordens_producao
  FOR INSERT
  USING (auth.uid() IS NOT NULL);

