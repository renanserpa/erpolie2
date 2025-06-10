import { Suspense } from 'react';
import { MovementsPageClient } from "./_components/MovementsPageClient";

export default function MovimentacoesEstoquePage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <MovementsPageClient />
    </Suspense>
  );
}
