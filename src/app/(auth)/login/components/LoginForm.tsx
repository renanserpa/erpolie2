"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { FC } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  Button,
} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import type { SupabaseAuthError } from "@/types/auth";

const credentialsSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export type CredentialsSchema = z.infer<typeof credentialsSchema>;

const LoginForm: FC = () => {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<CredentialsSchema>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<CredentialsSchema> = async (values) => {
    const { data, error }: { data: any; error: SupabaseAuthError | null } =
      await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password.trim(),
      });

    if (error) {
      toast.error("Falha no login. Verifique seu e-mail e senha.");
      console.error("Login error:", error.message);
      return;
    }

    try {
      type RoleQueryResult = { role: { name: string } | null } | null;
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role:roles(name)")
        .eq("user_id", data.user.id)
        .single<RoleQueryResult>();

      const roleName = roleData?.role?.name;
      if (roleName) {
        await supabase.auth.updateUser({ data: { role: roleName } });
      }
    } catch (e) {
      console.error("Erro ao atribuir role na sessão:", e);
    }

    toast.success("Login realizado com sucesso");
    router.push("/");
    router.refresh();
  };

  const {
    formState: { isSubmitting },
  } = form;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login Olie ERP</CardTitle>
          <CardDescription>
            Entre com seu e-mail e senha para acessar o sistema.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seuemail@exemplo.com"
                        autoFocus
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
              <Button variant="link" asChild className="w-full p-0 justify-center">
                <Link href="/recuperar-senha">Esqueceu sua senha?</Link>
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;

