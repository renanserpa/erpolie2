import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InsumosPage from "@/modules/insumos/InsumosPage";

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

    return <InsumosPage />;
  } catch {
    redirect("/login");
  }
}
