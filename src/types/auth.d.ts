import type { User, Session, AuthResponse, AuthError } from '@supabase/supabase-js'

export interface UserProfile {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  updated_at?: string | null;
}

export type AuthUser = User;
export type AuthSession = Session;
export type SupabaseAuthResponse<T = User> = AuthResponse<T>;
export type SupabaseAuthError = AuthError;
