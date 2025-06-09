"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Acesso negado</h1>
        <p className="text-muted-foreground">Você não possui permissão para acessar esta página.</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    </div>
  );
}
