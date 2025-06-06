"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setError("Token inválido");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.verifyOtp({
        type: "signup",
        token,
      });
      if (error) {
        console.error("Erro ao verificar cadastro:", error.message);
        setError("Não foi possível verificar o cadastro.");
        toast.error("Falha na verificação do cadastro");
      } else {
        setSuccess(true);
        toast.success("Cadastro confirmado com sucesso");
        setTimeout(() => router.push("/dashboard"), 5000);
      }
      setLoading(false);
    };

    verify();
  }, [router, supabase, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Verificação de Cadastro</CardTitle>
          <CardDescription>Confirmação do seu cadastro no Olie ERP</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {!loading && success && (
            <p className="text-green-600 dark:text-green-400">Cadastro verificado com sucesso! Redirecionando...</p>
          )}
          {!loading && error && (
            <p className="text-red-600 dark:text-red-400">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {!loading && (
            <Button onClick={() => router.push("/login")} variant="outline">
              Voltar ao Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
