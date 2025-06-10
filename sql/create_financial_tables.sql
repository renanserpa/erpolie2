-- Script para criação das tabelas financeiras ausentes
-- Tabela: financial_categories
CREATE TABLE IF NOT EXISTS public.financial_categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    parent_id uuid REFERENCES public.financial_categories(id),
    type_id uuid REFERENCES public.transaction_types(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_financial_categories_name ON public.financial_categories(name);

-- Tabela: payment_methods
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_payment_methods_name ON public.payment_methods(name);
