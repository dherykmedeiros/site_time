"use client";

import { useEffect, useState } from "react";
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
      // Will show create form
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
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {hasTeam ? "Configurações do Time" : "Criar Time"}
      </h1>

      {!hasTeam && (
        <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
          Você ainda não criou um time. Preencha as informações abaixo para começar.
        </div>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
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
                    primaryColor: team.primaryColor || "#0000FF",
                    secondaryColor: team.secondaryColor || "#FFFFFF",
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
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-gray-600">
              <strong>Vitrine pública:</strong>{" "}
              <a
                href={`/vitrine/${team.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
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
