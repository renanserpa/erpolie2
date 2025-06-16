import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = (): React.ReactElement => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
    <h2 className="text-3xl font-bold">Página não encontrada</h2>
    <Button asChild>
      <Link href="/">Voltar para o início</Link>
    </Button>
  </div>
);

export default NotFound;
