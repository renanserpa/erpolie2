"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");
    if (!token || !email) {
      setStatus("error");
      setMessage("Token ou email inválido.");
      return;
    }

    const verify = async () => {
      const { error } = await supabase.auth.verifyOtp({ type: "signup", token, email });
      if (error) {
        setStatus("error");
        setMessage(error.message);
      } else {
        setStatus("success");
      }
    };

    verify();
  }, [supabase]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <CardTitle>Confirmação de Cadastro</CardTitle>
          <CardDescription>Validando sua conta...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && <p>Validando...</p>}
          {status === "success" && (
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Conta confirmada!</AlertTitle>
              <AlertDescription>Agora você pode fazer login.</AlertDescription>
            </Alert>
          )}
          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => router.push("/login")}>Ir para o Login</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
