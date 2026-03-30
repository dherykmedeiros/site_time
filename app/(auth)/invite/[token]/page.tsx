"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { registerFromInviteSchema, type RegisterFromInviteInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function InvitePage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFromInviteInput>({
    resolver: zodResolver(registerFromInviteSchema),
    defaultValues: { token },
  });

  // Validate token format on mount
  useEffect(() => {
    // Basic UUID check for the token
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    setTokenValid(uuidRegex.test(token));
  }, [token]);

  async function onSubmit(data: RegisterFromInviteInput) {
    setError(null);

    const res = await fetch("/api/auth/register-from-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await res.json();

    if (!res.ok) {
      const messages: Record<string, string> = {
        TOKEN_NOT_FOUND: "Token de convite inválido.",
        TOKEN_EXPIRED: "Este convite expirou. Solicite um novo convite.",
        TOKEN_USED: "Este convite já foi utilizado.",
        EMAIL_EXISTS: "Este e-mail já está cadastrado.",
      };
      setError(messages[body.code] || body.error || "Erro ao criar conta.");
      return;
    }

    setSuccess(true);

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

  if (tokenValid === false) {
    return (
      <Card className="border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
        <div className="space-y-4 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            Convite de Acesso
          </p>
          <h1 className="font-display text-3xl font-bold text-[var(--text)]">Convite Invalido</h1>
          <p className="text-sm text-[var(--text-muted)]">
            O link recebido nao e valido. Verifique o endereco completo ou solicite um novo convite ao administrador.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] px-5 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            Voltar para login
          </Link>
        </div>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
        <div className="space-y-4 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            Convite Confirmado
          </p>
          <h1 className="font-display text-3xl font-bold text-emerald-700">Conta Criada</h1>
          <p className="text-sm text-[var(--text-muted)]">Acesso autorizado. Redirecionando para o painel...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
      <div className="space-y-6 p-6 sm:p-7">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            Convite de Jogador
          </p>
          <h1 className="font-display text-3xl font-bold text-[var(--text)]">Aceitar Convite</h1>
          <p className="text-sm text-[var(--text-muted)]">Crie sua conta para entrar no elenco e acessar o ambiente do time.</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("token")} />

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-[var(--text)]">
              Nome
            </label>
            <Input id="name" type="text" placeholder="Seu nome" {...register("name")} />
            {errors.name && (
              <p className="mt-1.5 text-sm text-rose-700">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-[var(--text)]">
              E-mail
            </label>
            <Input id="email" type="email" placeholder="seu@email.com" {...register("email")} />
            {errors.email && (
              <p className="mt-1.5 text-sm text-rose-700">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-[var(--text)]">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-rose-700">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>
      </div>
    </Card>
  );
}
