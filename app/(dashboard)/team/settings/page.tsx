"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { TeamForm } from "@/components/forms/TeamForm";

interface TeamData {
  name: string;
  slug: string;
  description: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  defaultVenue: string | null;
  badgeUrl: string | null;
}

export default function TeamSettingsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasTeam, setHasTeam] = useState(true);

  async function loadTeam() {
    try {
      const res = await fetch("/api/teams");
      if (res.status === 404) {
        setHasTeam(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
        setHasTeam(true);
      }
    } catch {
      setHasTeam(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeam();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--text-muted)]">Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-[22px] border border-[#f0d3b0] bg-gradient-to-r from-[#fff4e7] via-[#fff8ef] to-[#fffdf8] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#9a5b1b]">
            Acesso restrito
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--text)]">
            Configuracoes do Time
          </h1>
        </div>

        <Card className="rounded-[18px]">
          <CardContent className="py-8">
            <p className="text-sm text-[var(--text-muted)]">
              Somente administradores podem editar as configuracoes do time.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-[22px] border border-[#b7d8ce] bg-gradient-to-r from-[#e4f3ed] via-[#eff7ef] to-[#f7f1e7] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#2a6f60]">
          Identidade do clube
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--text)]">
          {hasTeam ? "Configuracoes do Time" : "Criar Time"}
        </h1>
      </div>

      {!hasTeam && (
        <div className="rounded-[14px] border border-[#bde0d3] bg-[#e9f8f1] p-4 text-sm text-[#1d5f4f]">
          Voce ainda nao criou um time. Preencha as informacoes abaixo para comecar.
        </div>
      )}

      <Card className="rounded-[18px]">
        <CardHeader>
          <h2 className="text-lg font-semibold text-[var(--text)]">
            {hasTeam ? "Perfil do Time" : "Novo Time"}
          </h2>
        </CardHeader>
        <CardContent>
          <TeamForm
            isCreating={!hasTeam}
            defaultValues={
              team
                ? {
                    name: team.name,
                    description: team.description || "",
                    primaryColor: team.primaryColor || "#0c6f5d",
                    secondaryColor: team.secondaryColor || "#f6f8f5",
                    defaultVenue: team.defaultVenue || "",
                    badgeUrl: team.badgeUrl || "",
                  }
                : undefined
            }
            onSuccess={() => {
              loadTeam();
              setHasTeam(true);
            }}
          />
        </CardContent>
      </Card>

      {team?.slug && (
        <Card className="rounded-[18px]">
          <CardContent className="py-4">
            <p className="text-sm text-[var(--text-muted)]">
              <strong>Vitrine publica:</strong>{" "}
              <a
                href={`/vitrine/${team.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--brand)] hover:underline"
              >
                /vitrine/{team.slug}
              </a>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
