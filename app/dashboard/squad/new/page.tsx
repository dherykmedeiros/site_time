"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PlayerForm } from "@/components/forms/PlayerForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function NewPlayerPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isCoachOrAdmin = role === "ADMIN" || role === "COACH";

  if (!isCoachOrAdmin) {
    return (
      <div className="p-8 text-center text-[var(--danger)]">
        Você não tem permissão para cadastrar jogadores.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Adicionar Jogador"
        description="Cadastre um novo atleta no elenco da equipe."
        breadcrumbs={[
          { label: "Elenco", href: "/dashboard/squad" },
          { label: "Novo Jogador" },
        ]}
        actions={
          <Button variant="ghost" onClick={() => router.push("/dashboard/squad")}>
            Voltar
          </Button>
        }
      />

      <Card>
        <CardContent className="p-6">
          <PlayerForm
            onSuccess={() => router.push("/dashboard/squad")}
            onCancel={() => router.push("/dashboard/squad")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
