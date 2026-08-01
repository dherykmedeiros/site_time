import { getSession } from "@/lib/auth";
import { getTeamData, getTeamMatches, getTeamStats } from "@/lib/team-data";
import PortalView from "@/components/portal/PortalView";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const team = await prisma.team.findFirst({
    select: { name: true, description: true, badgeUrl: true }
  });
  if (!team) {
    return { title: "Portal Esportivo | VARzea" };
  }
  const description = team.description || `Portal oficial do ${team.name}. Confira elenco, estatísticas e envie convites de amistosos.`;
  return {
    title: `${team.name} — Arena Oficial | VARzea`,
    description,
    openGraph: {
      title: team.name,
      description,
      type: "website",
      url: `/`,
      siteName: "VARzea",
      locale: "pt_BR",
      ...(team.badgeUrl && { images: [{ url: team.badgeUrl, width: 200, height: 200, alt: `Escudo ${team.name}` }] }),
    },
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ slot?: string; tab?: string }>;
}) {
  const session = await getSession();
  const team = await getTeamData();

  if (!team) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030708] px-6 py-20 text-center">
        <div className="relative mx-auto max-w-xl border-2 border-slate-800 bg-[#0b0f11] p-10 shadow-[6px_6px_0px_0px_#000] rounded-none">
          <span className="inline-flex rounded-none bg-black border-2 border-slate-800 px-3 py-1 text-xs font-black uppercase tracking-widest text-slate-400 font-mono">
            [SISTEMA APAGADO]
          </span>
          <h1 className="mt-6 text-3xl font-black text-white tracking-tight uppercase font-mono">Portal de Time Esportivo</h1>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed font-mono uppercase text-xs">
            Nenhuma equipe foi configurada no sistema. Acesse as configurações de diretoria para cadastrar as cores, escudo e elenco da sua equipe.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-none border-2 border-black bg-[#10b981] px-8 text-xs font-black uppercase tracking-[0.15em] text-[#010403] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.9)] active:translate-x-0 active:translate-y-0 duration-100"
          >
            Acessar Diretoria
          </Link>
        </div>
      </main>
    );
  }

  const resolvedSearchParams = await searchParams;
  const [stats, matches] = await Promise.all([
    getTeamStats(team.id),
    getTeamMatches(team.id),
  ]);

  return (
    <PortalView
      team={team}
      stats={stats}
      scheduledMatches={matches.scheduledMatches}
      finishedMatches={matches.finishedMatches}
      session={session}
      searchParams={resolvedSearchParams}
    />
  );
}
