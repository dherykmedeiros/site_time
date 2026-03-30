"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setError("E-mail ou senha inválidos");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <Card className="border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
      <div className="space-y-6 p-6 sm:p-7">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            Area Administrativa
          </p>
          <h1 className="font-display text-3xl font-bold text-[var(--text)]">Entrar</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Acesse seu painel para gerenciar elenco, partidas e resultados.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-[var(--text)]"
            >
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-rose-700">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-[var(--text)]"
            >
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-rose-700">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="mt-1 w-full" loading={isSubmitting}>
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)]">
          Não tem conta?{" "}
          <Link href="/register" className="font-semibold text-[var(--brand)] hover:text-[var(--brand-strong)]">
            Criar conta
          </Link>
        </p>
      </div>
    </Card>
  );
}
