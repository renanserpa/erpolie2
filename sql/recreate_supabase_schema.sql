-- Script gerado automaticamente para recriar o schema do Supabase
-- Baseado nos arquivos *.schema.ts e *.types.ts presentes em src/modules
-- Apaga todas as tabelas existentes e recria conforme estrutura final do ERP Olie

-- ========================================
-- DROP TABLES
-- ========================================
DO $$
DECLARE
    rec RECORD;
BEGIN
    -- remove all foreign key constraints and tables in proper order
    FOR rec IN (
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(rec.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- ========================================
-- CREATE TABLES
-- ========================================

-- Módulo: Usuários e Controle Global
CREATE TABLE public.global_statuses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    type text NOT NULL,
    color text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.divisions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text NOT NULL UNIQUE,
    name text,
    role text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Módulo: Clientes
CREATE TABLE public.clients (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text,
    phone text,
    document text,
    address text,
    city text,
    state text,
    postal_code text,
    notes text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.client_contacts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    name text NOT NULL,
    position text,
    email text,
    phone text,
    is_primary boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.client_addresses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    address_type text NOT NULL,
    address text NOT NULL,
    city text,
    state text,
    postal_code text,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Módulo: Fornecedores
CREATE TABLE public.suppliers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    fantasy_name text,
    email text,
    phone text,
    document text,
    address text,
    city text,
    state text,
    postal_code text,
    contact_name text,
    notes text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Módulo: Estoque
CREATE TABLE public.stock_groups (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.locations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    capacity numeric,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.unit_of_measurement (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    abbreviation text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.stock_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    sku text,
    description text,
    group_id uuid REFERENCES public.stock_groups(id),
    location_id uuid REFERENCES public.locations(id),
    unit_of_measurement_id uuid REFERENCES public.unit_of_measurement(id),
    quantity numeric DEFAULT 0,
    min_quantity numeric DEFAULT 0,
    max_quantity numeric,
    unit_cost numeric,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.stock_movements (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_item_id uuid REFERENCES public.stock_items(id),
    quantity numeric NOT NULL,
    movement_type text NOT NULL,
    reference_id uuid,
    reference_type text,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Módulo: Componentes
CREATE TABLE public.components (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    sku text,
    category_id uuid,
    unit_of_measurement_id uuid REFERENCES public.unit_of_measurement(id),
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.componente_insumo (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    componente_id uuid REFERENCES public.components(id) ON DELETE CASCADE,
    insumo_id uuid REFERENCES public.stock_items(id) ON DELETE CASCADE,
    quantidade numeric NOT NULL,
    unidade_medida_id uuid REFERENCES public.unit_of_measurement(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Módulo: Produtos
CREATE TABLE public.product_categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    parent_category_id uuid REFERENCES public.product_categories(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    sku text,
    price numeric,
    cost numeric,
    category_id uuid REFERENCES public.product_categories(id),
    division_id uuid REFERENCES public.divisions(id),
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.product_components (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    component_id uuid REFERENCES public.components(id) ON DELETE CASCADE,
    quantity numeric NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Módulo: Pedidos
CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number text NOT NULL,
    client_id uuid REFERENCES public.clients(id),
    total_amount numeric NOT NULL,
    status_id uuid REFERENCES public.global_statuses(id),
    notes text,
    delivery_date date,
    division_id uuid REFERENCES public.divisions(id),
    production_order_requested boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id),
    quantity integer NOT NULL,
    price numeric NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Módulo: Produção
CREATE TABLE public.production_orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    status_id uuid REFERENCES public.global_statuses(id),
    start_date date,
    end_date date,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.production_stages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    "order" integer,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.production_stage_history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    production_order_id uuid REFERENCES public.production_orders(id) ON DELETE CASCADE,
    stage_id uuid REFERENCES public.production_stages(id),
    user_id uuid REFERENCES public.users(id),
    start_date date,
    end_date date,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Módulo: Compras
CREATE TABLE public.purchase_requests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id uuid REFERENCES public.suppliers(id),
    status_id uuid REFERENCES public.global_statuses(id),
    total_amount numeric NOT NULL,
    notes text,
    expected_delivery_date date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.purchase_orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id uuid REFERENCES public.suppliers(id),
    status_id uuid REFERENCES public.global_statuses(id),
    order_date date,
    expected_delivery_date date,
    total_amount numeric NOT NULL,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.purchase_order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id uuid REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    stock_item_id uuid REFERENCES public.stock_items(id),
    quantity numeric NOT NULL,
    unit_price numeric NOT NULL,
    received_quantity numeric,
    total_price numeric,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Módulo: Logística
CREATE TABLE public.delivery_routes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    date date NOT NULL,
    status_id uuid REFERENCES public.global_statuses(id),
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.deliveries (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    route_id uuid REFERENCES public.delivery_routes(id),
    driver_id uuid,
    transporter_id uuid,
    tracking_code text,
    delivery_date date,
    status_id uuid REFERENCES public.global_statuses(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Módulo: Financeiro
CREATE TABLE public.financial_categories (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    parent_id uuid REFERENCES public.financial_categories(id),
    type_id uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

CREATE TABLE public.payment_methods (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

CREATE TABLE public.financial_transactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    date date NOT NULL,
    amount numeric NOT NULL,
    type text NOT NULL,
    category_id uuid REFERENCES public.financial_categories(id),
    description text,
    reference_id uuid,
    reference_type text,
    division_id uuid REFERENCES public.divisions(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Módulo: Recursos Humanos
CREATE TABLE public.employment_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);

CREATE TABLE public.employees (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    role text,
    employment_type_id uuid REFERENCES public.employment_types(id),
    hire_date date,
    status text,
    email text,
    phone text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    user_id uuid REFERENCES public.users(id)
);

CREATE TABLE public.user_permissions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    module text NOT NULL,
    role text NOT NULL,
    user_id uuid REFERENCES public.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ========================================
-- Dados de teste
-- ========================================
INSERT INTO global_statuses (name, type, created_at, updated_at)
VALUES ('Ativo', 'geral', now(), now())
ON CONFLICT DO NOTHING;

INSERT INTO divisions (name) VALUES ('Principal') ON CONFLICT DO NOTHING;

INSERT INTO users (email, name) VALUES ('admin@example.com', 'Admin') ON CONFLICT DO NOTHING;

INSERT INTO clients (name) VALUES ('Cliente Teste');
INSERT INTO suppliers (name) VALUES ('Fornecedor Teste');
INSERT INTO stock_groups (name) VALUES ('Grupo Padrão');
INSERT INTO locations (name) VALUES ('Estoque Central');
INSERT INTO unit_of_measurement (name, abbreviation) VALUES ('Unidade','un');
INSERT INTO stock_items (name, quantity) VALUES ('Item Teste', 10);
INSERT INTO components (name) VALUES ('Componente Teste');
INSERT INTO products (name) VALUES ('Produto Teste');
INSERT INTO orders (order_number, client_id, total_amount, status_id)
  VALUES ('ORD-1', (SELECT id FROM clients LIMIT 1), 100, (SELECT id FROM global_statuses LIMIT 1));
INSERT INTO production_stages (name) VALUES ('Preparação');
INSERT INTO purchase_orders (supplier_id, status_id, order_date, total_amount)
  VALUES ((SELECT id FROM suppliers LIMIT 1), (SELECT id FROM global_statuses LIMIT 1), current_date, 200);
INSERT INTO delivery_routes (name, date, status_id)
  VALUES ('Rota 1', current_date, (SELECT id FROM global_statuses LIMIT 1));
INSERT INTO financial_categories (name) VALUES ('Categoria Financeira');
INSERT INTO payment_methods (name) VALUES ('Dinheiro');
INSERT INTO financial_transactions (date, amount, type)
  VALUES (current_date, 50, 'expense');
INSERT INTO employment_types (name) VALUES ('CLT');
INSERT INTO employees (name) VALUES ('Colaborador Teste');
