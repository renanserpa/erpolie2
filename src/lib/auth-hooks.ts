// @ts-nocheck
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { handleSupabaseError } from "@/lib/data-hooks";
import { toast } from "sonner";
import type { AuthUser } from "@/types/auth";

// Hook para gerenciar autenticação
export const useAuth = () => {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("Erro ao verificar autenticação:", message);
        setError(message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        setUser(data.user);
        router.push('/dashboard');
        toast.success("Login realizado com sucesso!");
        return { success: true };
      }
    } catch (err: unknown) {
      const errorMsg = handleSupabaseError(err, "Falha ao realizar login");
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      router.push('/login');
      toast.success("Logout realizado com sucesso!");
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = handleSupabaseError(err, "Falha ao realizar logout");
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Email de recuperação enviado com sucesso!");
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = handleSupabaseError(err, "Falha ao enviar email de recuperação");
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Senha atualizada com sucesso!");
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = handleSupabaseError(err, "Falha ao atualizar senha");
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user
  };
};
