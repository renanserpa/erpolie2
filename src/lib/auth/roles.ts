export enum UserRole {
  Admin = 'Admin',
  Financeiro = 'Financeiro',
  Compras = 'Compras',
  Producao = 'Producao',
  RH = 'RH',
  Logistica = 'Logistica',
  Treinamento = 'Treinamento'
}

/** Prefixos de rotas protegidas e os perfis que podem acessá-las */
export const ACCESS_RULES: { prefix: string; roles: UserRole[] }[] = [
  { prefix: '/financeiro', roles: [UserRole.Financeiro, UserRole.Admin] },
  { prefix: '/compras', roles: [UserRole.Compras, UserRole.Admin] },
  { prefix: '/producao', roles: [UserRole.Producao, UserRole.Admin] },
  { prefix: '/rh', roles: [UserRole.RH, UserRole.Admin] },
  { prefix: '/logistica', roles: [UserRole.Logistica, UserRole.Admin] },
  { prefix: '/treinamento', roles: [UserRole.Treinamento, UserRole.Admin] }
];

export function canAccessRoute(path: string, userRole?: string | null): boolean {
  if (!userRole) return false;
  const rule = ACCESS_RULES.find((r) => path.startsWith(r.prefix));
  if (!rule) return true;
  return rule.roles.includes(userRole as UserRole);
}
