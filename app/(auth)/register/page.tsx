"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      if (body.error === "EMAIL_EXISTS") {
        setError("Este e-mail já está cadastrado");
      } else if (body.error === "REGISTRATION_LOCKED") {
        setError("Cadastro administrativo bloqueado. Solicite o código de cadastro ao responsável pela liga.");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
      return;
    }

    // Auto-login after registration
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      router.push("/login");
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
            Novo Gestor
          </p>
          <h1 className="font-display text-3xl font-bold text-[var(--text)]">Criar Conta</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Inicie seu painel e comece a organizar a temporada com seu time.
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
              htmlFor="name"
              className="mb-1.5 block text-sm font-semibold text-[var(--text)]"
            >
              Nome
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-rose-700">
                {errors.name.message}
              </p>
            )}
          </div>

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

          <div>
            <label
              htmlFor="registrationCode"
              className="mb-1.5 block text-sm font-semibold text-[var(--text)]"
            >
              Código de cadastro administrativo (opcional)
            </label>
            <Input
              id="registrationCode"
              type="text"
              placeholder="Informe se sua liga forneceu"
              {...register("registrationCode")}
            />
            {errors.registrationCode && (
              <p className="mt-1.5 text-sm text-rose-700">
                {errors.registrationCode.message}
              </p>
            )}
            <p className="mt-1.5 text-xs text-[var(--text-subtle)]">
              Use este campo apenas se a liga forneceu um codigo para habilitar novos administradores.
            </p>
          </div>

          <Button type="submit" className="mt-1 w-full" loading={isSubmitting}>
            Criar Conta
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)]">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-[var(--brand)] hover:text-[var(--brand-strong)]">
            Entrar
          </Link>
        </p>
      </div>
    </Card>
  );
}
