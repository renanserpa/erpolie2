-- Criação da tabela de status de produtos
CREATE TABLE IF NOT EXISTS public.product_statuses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Inserir valores padrão se ainda não existirem
INSERT INTO public.product_statuses (name, description)
VALUES
    ('Ativo', 'Produto disponível para venda'),
    ('Inativo', 'Produto temporariamente indisponível'),
    ('Descontinuado', 'Produto fora de linha')
ON CONFLICT (name) DO NOTHING;

-- Habilitar Row Level Security e permitir leitura de usuários autenticados
ALTER TABLE public.product_statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read" ON public.product_statuses
  FOR SELECT USING (auth.role() = 'authenticated');
