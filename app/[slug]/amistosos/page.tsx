import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FriendlyRequestForm } from "@/app/FriendlyRequestForm";
import { FriendlyInviteShareActions } from "@/components/friendly/FriendlyInviteShareActions";
import { normalizeAllowedWeekdays } from "@/lib/friendly-availability";

export const revalidate = 60;

interface FriendlyInvitePageProps {
  params: Promise<{ slug: string }>;
}

const weekdayLabels = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

export async function generateMetadata({ params }: FriendlyInvitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await prisma.team.findUnique({
    where: { slug },
    select: { name: true, badgeUrl: true, city: true },
  });

  if (!team) return { title: "Agenda de amistosos | VARzea" };

  const description = `Veja as datas disponíveis do ${team.name}${team.city ? `, de ${team.city}` : ""} e envie um convite direto para amistoso.`;
  return {
    title: `Marcar amistoso com ${team.name} | VARzea`,
    description,
    openGraph: {
      title: `${team.name} está disponível para amistosos`,
      description,
      type: "website",
      url: `/${slug}/amistosos`,
      ...(team.badgeUrl && { images: [{ url: team.badgeUrl, alt: `Escudo ${team.name}` }] }),
    },
  };
}

export default async function FriendlyInvitePage({ params }: FriendlyInvitePageProps) {
  const { slug } = await params;
  const team = await prisma.team.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      badgeUrl: true,
      description: true,
      city: true,
      region: true,
      defaultVenue: true,
      friendlyInvitesEnabled: true,
      friendlyInviteMinNoticeDays: true,
      friendlyInviteMaxAdvanceDays: true,
      friendlyInviteBufferBeforeDays: true,
      friendlyInviteBufferAfterDays: true,
      friendlyInviteAllowedWeekdays: true,
      friendlyInviteWhatsapp: true,
    },
  });

  if (!team) notFound();

  const allowedWeekdays = normalizeAllowedWeekdays(team.friendlyInviteAllowedWeekdays);
  const allowedWeekdayText = allowedWeekdays.length === 7
    ? "Todos os dias"
    : allowedWeekdays.map((day) => weekdayLabels[day]).join(", ");

  return (
    <main className="min-h-screen bg-[#050807] px-4 py-8 text-white sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="border-2 border-emerald-900 bg-[#090d0f] p-5 shadow-[6px_6px_0px_0px_#064e3b] sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {team.badgeUrl ? (
                <img
                  src={team.badgeUrl}
                  alt={`Escudo do ${team.name}`}
                  className="h-20 w-20 border-2 border-emerald-700 bg-black object-contain p-1 sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center border-2 border-emerald-700 bg-emerald-950 text-2xl font-black text-emerald-300 sm:h-24 sm:w-24">
                  {team.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-emerald-400">
                  Agenda pública de amistosos
                </p>
                <h1 className="mt-1 text-2xl font-black uppercase tracking-tight sm:text-4xl">{team.name}</h1>
                <p className="mt-2 text-sm text-slate-400">
                  {[team.city, team.region].filter(Boolean).join(" · ") || "Localidade não informada"}
                </p>
              </div>
            </div>
            <FriendlyInviteShareActions teamName={team.name} />
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="border border-slate-800 bg-[#090d0f] p-5 sm:p-7">
            <div className="mb-6">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Convite direto</p>
              <h2 className="mt-1 text-xl font-black uppercase sm:text-2xl">Escolha uma data disponível</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Os dias com jogos confirmados e os intervalos de descanso definidos pelo clube já aparecem bloqueados.
              </p>
              {team.friendlyInviteWhatsapp && (
                <p className="mt-3 border border-emerald-900 bg-emerald-950/20 p-3 text-xs font-bold text-emerald-300">
                  Após registrar o convite, você será encaminhado ao WhatsApp do time com a mensagem preenchida para confirmar o envio.
                </p>
              )}
            </div>
            <FriendlyRequestForm teamSlug={team.slug} initialSuggestedVenue={team.defaultVenue || ""} />
          </section>

          <aside className="space-y-4">
            {!team.friendlyInvitesEnabled && (
              <div className="border-2 border-amber-800 bg-amber-950/20 p-4 text-sm font-bold text-amber-300">
                Este time pausou temporariamente o recebimento de novos convites.
              </div>
            )}

            <div className="border border-slate-800 bg-[#090d0f] p-5">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Regras da agenda</p>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">Dias aceitos</dt>
                  <dd className="mt-1 font-bold capitalize text-white">{allowedWeekdayText || "Nenhum dia selecionado"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Antecedência mínima</dt>
                  <dd className="mt-1 font-bold text-white">{team.friendlyInviteMinNoticeDays} dia(s)</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Agenda aberta</dt>
                  <dd className="mt-1 font-bold text-white">Próximos {team.friendlyInviteMaxAdvanceDays} dia(s)</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Intervalo entre jogos</dt>
                  <dd className="mt-1 font-bold text-white">
                    {team.friendlyInviteBufferBeforeDays} dia(s) antes · {team.friendlyInviteBufferAfterDays} depois
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Local padrão</dt>
                  <dd className="mt-1 font-bold text-white">{team.defaultVenue || "A combinar"}</dd>
                </div>
              </dl>
            </div>

            {team.description && (
              <div className="border border-slate-800 bg-[#090d0f] p-5 text-sm leading-relaxed text-slate-400">
                {team.description}
              </div>
            )}

            <Link
              href={`/${team.slug}`}
              className="inline-flex min-h-11 w-full items-center justify-center border border-slate-700 bg-slate-900/50 px-4 text-xs font-black uppercase tracking-wider text-slate-300 transition hover:border-emerald-700 hover:text-emerald-300"
            >
              Ver perfil completo do time
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
