"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { AuthUser, AuthSession, SupabaseAuthError, UserProfile } from "@/types/auth";

// Tipos para o sistema de permissões
export type Permission = {
  id: string;
  name: string;
  code: string;
  description?: string;
  module_id: string;
};

export type Role = {
  id: string;
  name: string;
  description?: string;
  is_system: boolean;
  is_active: boolean;
};

export type UserRole = {
  id: string;
  role_id: string;
  role: Role;
};

export type Module = {
  id: string;
  name: string;
  path: string;
  icon: string;
  description?: string;
  order_index: number;
  is_active: boolean;
};

// Contexto de autenticação e autorização
type AuthContextType = {
  user: AuthUser | null;
  profile: UserProfile | null;
  roles: Role[];
  permissions: Permission[];
  modules: Module[];
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permissionCode: string) => boolean;
  hasRole: (roleName: string) => boolean;
  canAccessModule: (modulePath: string) => boolean;
  refreshPermissions: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carregar usuário e permissões
  useEffect(() => {
    const loadUserAndPermissions = async () => {
      setIsLoading(true);
      try {
        // Obter usuário autenticado de forma segura
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Erro ao obter usuário:", userError);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        if (!user) {
          setUser(null);
          setProfile(null);
          setRoles([]);
          setPermissions([]);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setUser(user);
        setIsAuthenticated(true);
        
        try {
          // Validar usuário autenticado e carregar perfil
          const { data: userResult, error: userError } = await supabase.auth.getUser();

          if (userError) {
            console.warn("Falha ao autenticar usuário:", userError.message || userError);
            return;
          }

          const validatedUser = userResult?.user;
          if (!validatedUser?.id) {
            console.warn("Usuário não autenticado ou sem ID.");
            return;
          }

          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", validatedUser.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.warn("Erro ao carregar perfil:", profileError.message || profileError);
          } else if (profileData) {
            setProfile(profileData);
          }
        } catch (profileLoadError) {
          console.warn("Erro ao carregar perfil do usuário:", profileLoadError);
          // Continua o fluxo mesmo com erro no perfil
        }
        
        try {
          // Carregar roles do usuário
          const { data: rolesData, error: rolesError } = await supabase
            .from("users_permissions")
            .select("role")
            .eq("user_id", user.id);

          if (rolesError) {
            console.warn("Erro ao carregar roles:", rolesError.message || rolesError);
            setRoles([]);
          } else {
            const roles = rolesData?.map(r => r.role) || [];
            setRoles(roles);

            // Se o usuário tem roles, carregar permissões associadas
            if (roles.length > 0) {
              const roleIds = roles.map(r => r.id);
              
              try {
                const { data: permissionsData, error: permissionsError } = await supabase
                  .from('role_permissions')
                  .select(
                    `
                      permission:permissions (
                        id,
                        name,
                        code,
                        description,
                        module_id
                      )
                    `
                  )
                  .in('role_id', roleIds)
                  .returns<{ permission: Permission | null }[]>();
                  
                if (permissionsError) {
                  console.error("Erro ao carregar permissões:", permissionsError);
                  // Continua com permissões vazias
                  setPermissions([]);
                } else {
                  // Extrair permissões únicas e filtrar nulos
                  const validPermissions = permissionsData
                    .filter((rp): rp is { permission: Permission } => Boolean(rp.permission))
                    .map(rp => rp.permission);
                  
                  const uniquePermissions = Array.from(
                    new Map(validPermissions.map(p => [p.id, p])).values()
                  );
                  
                  setPermissions(uniquePermissions);
                  
                  // Carregar módulos acessíveis
                  const moduleIds = Array.from(
                    new Set(uniquePermissions.map(p => p.module_id).filter(Boolean))
                  );
                  
                  if (moduleIds.length > 0) {
                    try {
                      const { data: modulesData, error: modulesError } = await supabase
                        .from('modules')
                        .select('*')
                        .in('id', moduleIds)
                        .eq('is_active', true)
                        .order('order_index');
                        
                      if (modulesError) {
                        console.error("Erro ao carregar módulos:", modulesError);
                        // Continua com módulos vazios
                        setModules([]);
                      } else {
                        setModules(modulesData || []);
                      }
                    } catch (modulesLoadError) {
                      console.error("Erro ao carregar módulos:", modulesLoadError);
                      setModules([]);
                    }
                  }
                }
              } catch (permissionsLoadError) {
                console.error("Erro ao carregar permissões:", permissionsLoadError);
                setPermissions([]);
              }
            }
          }
        } catch (rolesLoadError) {
          console.error("Erro ao carregar roles do usuário:", rolesLoadError);
          setRoles([]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados de autenticação:", error);
        toast.error("Erro ao carregar dados de autenticação. Tente novamente.");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Configurar listener para mudanças de autenticação e sessão inicial
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (
          event === 'INITIAL_SESSION' ||
          event === 'SIGNED_IN' ||
          event === 'TOKEN_REFRESHED'
        ) {
          await loadUserAndPermissions();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setRoles([]);
          setPermissions([]);
          setModules([]);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);
  
  // Verificar se o usuário tem uma permissão específica
  const hasPermission = (permissionCode: string): boolean => {
    if (!user || permissions.length === 0) return false;
    return permissions.some(p => p.code === permissionCode);
  };
  
  // Verificar se o usuário tem um role específico
  const hasRole = (roleName: string): boolean => {
    if (!user || roles.length === 0) return false;
    return roles.some(r => r.name === roleName);
  };
  
  // Verificar se o usuário pode acessar um módulo específico
  const canAccessModule = (modulePath: string): boolean => {
    if (!user || modules.length === 0) return false;
    return modules.some(m => m.path === modulePath);
  };
  
  // Recarregar permissões do usuário
  const refreshPermissions = async (): Promise<void> => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      // Carregar roles do usuário
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          id,
          role_id,
          role:roles (
            id,
            name,
            description,
            is_system,
            is_active
          )
        `)
        .eq('user_id', user.id)
        .returns<(UserRole & { role: Role | null })[]>();
        
      if (rolesError) {
        console.error("Erro ao recarregar roles:", rolesError);
        return;
      }
      
      const typedRoles = (userRoles ?? []) as Array<UserRole & { role: Role | null }>;
      const validRoles = typedRoles
        .filter((ur): ur is UserRole & { role: Role } => Boolean(ur.role) && ur.role.is_active)
        .map(ur => ur.role);
      
      setRoles(validRoles);
      
      // Se o usuário tem roles, carregar permissões associadas
      if (validRoles.length > 0) {
        const roleIds = validRoles.map(r => r.id);
        
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('role_permissions')
        .select(
          `
            permission:permissions (
              id,
              name,
              code,
              description,
              module_id
            )
          `
        )
        .in('role_id', roleIds)
        .returns<{ permission: Permission | null }[]>();
          
        if (permissionsError) {
          console.error("Erro ao recarregar permissões:", permissionsError);
          return;
        }
        
        // Extrair permissões únicas
        const validPermissions = permissionsData
          .filter((rp): rp is { permission: Permission } => Boolean(rp.permission))
          .map(rp => rp.permission);
        
        const uniquePermissions = Array.from(
          new Map(validPermissions.map(p => [p.id, p])).values()
        );
        
        setPermissions(uniquePermissions);
        
        // Carregar módulos acessíveis
        const moduleIds = Array.from(
          new Set(uniquePermissions.map(p => p.module_id).filter(Boolean))
        );
        
        if (moduleIds.length > 0) {
          const { data: modulesData, error: modulesError } = await supabase
            .from('modules')
            .select('*')
            .in('id', moduleIds)
            .eq('is_active', true)
            .order('order_index');
            
          if (modulesError) {
            console.error("Erro ao recarregar módulos:", modulesError);
          } else {
            setModules(modulesData || []);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao recarregar permissões:", error);
      toast.error("Erro ao atualizar permissões. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { error }: { error: SupabaseAuthError | null } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao fazer logout:", error);
        toast.error("Erro ao fazer logout. Tente novamente.");
      } else {
        toast.success("Logout realizado com sucesso");
      }
    } catch (error: unknown) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout. Tente novamente.");
    } finally {
      setIsLoading(false);
      setIsAuthenticated(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        roles,
        permissions,
        modules,
        isLoading,
        isAuthenticated,
        hasPermission,
        hasRole,
        canAccessModule,
        refreshPermissions,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Alias para compatibilidade com layouts que esperam AuthContextProvider
export { AuthProvider as AuthContextProvider };
