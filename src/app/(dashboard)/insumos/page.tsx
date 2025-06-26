import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InsumosPage from "@/modules/insumos/InsumosPage";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <InsumosPage />;
}
