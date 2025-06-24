-- Enable RLS and allow insert for components
ALTER TABLE components ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow insert" ON components;
CREATE POLICY "allow insert" ON components
  FOR INSERT TO authenticated USING (true);

-- Enable RLS and allow insert for stock_items
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow insert" ON stock_items;
CREATE POLICY "allow insert" ON stock_items
  FOR INSERT TO authenticated USING (true);
