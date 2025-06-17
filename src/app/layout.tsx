import "./globals.css";
import * as React from "react";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import { AuthProvider } from "@/contexts/auth-context";
import { ProvidersWrapper } from "@/contexts/providers-wrapper";
import { SupabaseSessionProvider } from "@/contexts/supabase-session-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Olie ERP',
  description: 'Sistema de gestão empresarial para Olie Ateliê',
}

export interface LayoutProps {
  children: React.ReactNode;
}

const RootLayout = async ({ children }: LayoutProps): Promise<React.ReactElement> => {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SupabaseSessionProvider initialSession={session}>
          <AuthProvider>
            <ProvidersWrapper>
              {children}
              <Toaster />
            </ProvidersWrapper>
          </AuthProvider>
        </SupabaseSessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
