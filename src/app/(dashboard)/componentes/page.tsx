import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ComponentesPage from "@/modules/componentes/ComponentesPage";

export default async function Page() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      redirect("/login");
    }

    return <ComponentesPage />;
  } catch {
    redirect("/login");
  }
}
