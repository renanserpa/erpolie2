import "./globals.css";
import * as React from "react";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { ProvidersWrapper } from "@/contexts/providers-wrapper";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Olie ERP',
  description: 'Sistema de gestão empresarial para Olie Ateliê',
}

export interface LayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<LayoutProps> = ({ children }): React.ReactElement => {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <ProvidersWrapper>
            {children}
            <Toaster />
          </ProvidersWrapper>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
