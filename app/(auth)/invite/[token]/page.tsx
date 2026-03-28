"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
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
      <Card>
        <div className="p-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Convite Inválido</h1>
          <p className="text-gray-600">O link de convite não é válido. Verifique o link ou solicite um novo convite.</p>
        </div>
      </Card>
    );
  }

  if (success) {
    return (
      <Card>
        <div className="p-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-green-700">Conta Criada!</h1>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Aceitar Convite
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Crie sua conta para acessar o time.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("token")} />

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Nome
            </label>
            <Input id="name" type="text" placeholder="Seu nome" {...register("name")} />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <Input id="email" type="email" placeholder="seu@email.com" {...register("email")} />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
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
