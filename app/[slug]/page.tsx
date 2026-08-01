import { getSession } from "@/lib/auth";
import { getTeamData, getTeamMatches, getTeamStats } from "@/lib/team-data";
import PortalView from "@/components/portal/PortalView";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
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
    select: { name: true, description: true, badgeUrl: true, city: true }
  });

  if (!team) {
    return { title: "Portal Esportivo | VARzea" };
  }

  const description = team.description || `Portal oficial do ${team.name}${team.city ? ` (${team.city})` : ""}. Confira elenco, estatísticas e envie convites de amistosos.`;

  return {
    title: `${team.name} — Arena Oficial | VARzea`,
    description,
    openGraph: {
      title: `${team.name} | Clube de Futebol`,
      description,
      type: "website",
      url: `/${slug}`,
      siteName: "VARzea",
      locale: "pt_BR",
      ...(team.badgeUrl && { images: [{ url: team.badgeUrl, width: 600, height: 600, alt: `Escudo ${team.name}` }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: team.name,
      description,
      ...(team.badgeUrl && { images: [team.badgeUrl] }),
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "name": team.name,
    "description": team.description || `Portal oficial do ${team.name}`,
    "logo": team.badgeUrl || undefined,
    "url": `/${team.slug}`,
    "location": {
      "@type": "Place",
      "name": team.defaultVenue || team.city || "Brasil",
      "address": team.city || undefined,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortalView
        team={team}
        stats={stats}
        scheduledMatches={matches.scheduledMatches}
        finishedMatches={matches.finishedMatches}
        session={session}
        searchParams={resolvedSearchParams}
      />
    </>
  );
}
