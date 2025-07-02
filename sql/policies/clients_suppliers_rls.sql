ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "TEMP: acesso total" ON clients;
CREATE POLICY "TEMP: acesso total"
ON clients
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profiles p
    WHERE p.user_id = auth.uid() AND p.email IN (
      'atendimento@atelieolie.com.br', 'serparenan@gmail.com'
    )
  )
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "TEMP: acesso total" ON suppliers;
CREATE POLICY "TEMP: acesso total"
ON suppliers
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users_profiles p
    WHERE p.user_id = auth.uid() AND p.email IN (
      'atendimento@atelieolie.com.br', 'serparenan@gmail.com'
    )
  )
);
