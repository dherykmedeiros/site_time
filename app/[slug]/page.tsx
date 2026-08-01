import { getSession } from "@/lib/auth";
import { getTeamData, getTeamMatches, getTeamStats } from "@/lib/team-data";
import PortalView from "@/components/portal/PortalView";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface SlugPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ slot?: string; tab?: string }>;
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await prisma.team.findUnique({
    where: { slug },
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
      url: `/${slug}`,
      siteName: "VARzea",
      locale: "pt_BR",
      ...(team.badgeUrl && { images: [{ url: team.badgeUrl, width: 200, height: 200, alt: `Escudo ${team.name}` }] }),
    },
  };
}

export default async function SlugPage({
  params,
  searchParams,
}: SlugPageProps) {
  const session = await getSession();
  const { slug } = await params;
  const team = await getTeamData(slug);

  if (!team) {
    notFound();
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
