import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "VARzea — Plataforma SaaS de Gestão de Times Amadores e Várzea",
  description:
    "A plataforma completa para gestão de equipes esportivas amadoras. Portais públicos exclusivos, escalação tática, súmula ao vivo, financeiro PIX e agendamento de amistosos.",
  openGraph: {
    title: "VARzea — Plataforma de Gestão de Times",
    description: "Crie a arena digital da sua equipe. Elenco, partidas, estatísticas e financeiro em um só lugar.",
    type: "website",
    url: "/",
    siteName: "VARzea",
    locale: "pt_BR",
  },
};

const fieldTypeLabels: Record<string, string> = {
  GRASS: "Grama Natural",
  SYNTHETIC: "Grama Sintética",
  FUTSAL: "Futsal / Quadra",
  SOCIETY: "Society",
  OTHER: "Outro",
};

const levelLabels: Record<string, string> = {
  CASUAL: "Casual / Recreativo",
  INTERMEDIATE: "Intermediário",
  COMPETITIVE: "Competitivo / Várzea Forte",
};

export default async function HomePage() {
  const session = await getSession();

  const [teams, openSlots] = await Promise.all([
    prisma.team.findMany({
      where: { publicDirectoryOptIn: true },
      select: {
        id: true,
        name: true,
        shortName: true,
        slug: true,
        badgeUrl: true,
        description: true,
        city: true,
        region: true,
        fieldType: true,
        competitiveLevel: true,
        primaryColor: true,
        secondaryColor: true,
        foundedYear: true,
        _count: {
          select: { players: true, matches: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.openMatchSlot.findMany({
      where: { status: "OPEN" },
      take: 3,
      orderBy: { date: "asc" },
      include: {
        team: {
          select: {
            name: true,
            slug: true,
            badgeUrl: true,
            city: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#06090b] text-[#f0f7f4] font-sans antialiased selection:bg-[#10b981] selection:text-black">
      {/* Top Session Bar (If Admin Logged In) */}
      {session && (
        <div className="bg-[#10b981] text-[#06090b] px-4 py-2 text-center text-xs font-black uppercase tracking-widest font-mono shadow-md">
          🟢 VOCÊ ESTÁ AUTENTICADO —{" "}
          <Link href="/dashboard" className="underline hover:opacity-80">
            Acessar Painel de Controle da Equipe &rarr;
          </Link>
        </div>
      )}

      {/* Main SaaS Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090d0f]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#10b981] to-[#047857] text-black shadow-lg group-hover:scale-105 transition-transform">
              <span className="font-mono text-xl font-black">V</span>
            </div>
            <div>
              <span className="font-mono text-xl font-black tracking-wider text-white uppercase block leading-none">
                VAR<span className="text-[#10b981]">zea</span>
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                SaaS Esportivo
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#times" className="hover:text-[#10b981] transition-colors">
              Equipes Cadastradas
            </a>
            <a href="#recursos" className="hover:text-[#10b981] transition-colors">
              Recursos
            </a>
            <Link href="/vagas" className="hover:text-[#10b981] transition-colors flex items-center gap-1.5">
              <span>⚔️</span> Vagas & Desafios
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={session ? "/dashboard" : "/login"}
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#10b981] hover:bg-[#34d399] px-5 text-xs font-black uppercase tracking-wider text-black transition-all shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)] active:scale-95"
            >
              {session ? "Painel Admin ↗" : "Acessar Diretoria 🔐"}
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#10b981] font-mono shadow-inner">
            <span>⚽</span> Sistema Multi-Time para Futebol Amador & Várzea
          </div>

          <h1 className="text-balance font-mono text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none">
            A Arena Digital da Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] via-[#34d399] to-[#6ee7b7]">Equipe Esportiva</span>.
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
            Gerencie elencos, monte escalações táticas, acompanhe partidas ao vivo, controle o caixa financeiro com PIX e publique a vitrine oficial do seu time com link exclusivo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#times"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white hover:bg-slate-200 px-8 text-xs font-black uppercase tracking-wider text-black transition-all shadow-lg active:scale-95"
            >
              Explorar Equipes Cadastradas &rarr;
            </a>
            <Link
              href="/vagas"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-8 text-xs font-black uppercase tracking-wider text-white transition-all backdrop-blur-sm active:scale-95"
            >
              ⚔️ Procurar Amistosos / Vagas
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10 text-center font-mono">
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
              <span className="block text-3xl font-black text-white">{teams.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Times Ativos</span>
            </div>
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
              <span className="block text-3xl font-black text-[#10b981]">100%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Isolamento Multi-Tenant</span>
            </div>
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
              <span className="block text-3xl font-black text-white">{openSlots.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vagas Abertas</span>
            </div>
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
              <span className="block text-3xl font-black text-[#34d399]">Ao Vivo</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Súmula & Placares</span>
            </div>
          </div>
        </div>
      </section>

      {/* Directory of Teams Section */}
      <section id="times" className="py-16 px-4 bg-[#090d0f] border-y border-white/10">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="font-mono text-xs font-black uppercase tracking-widest text-[#10b981]">
                ▸ Diretório de Clubes
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-mono tracking-tight mt-1">
                Equipes na Plataforma VARzea
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Acesse o portal público de cada time para conferir elenco, estatísticas e solicitar amistosos.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-slate-400 uppercase bg-white/5 border border-white/10 px-4 py-2 rounded-xl w-fit">
              {teams.length} {teams.length === 1 ? "Equipe Cadastrada" : "Equipes Cadastradas"}
            </span>
          </div>

          {teams.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center text-slate-400 font-mono">
              <p className="text-4xl mb-3">⚽</p>
              <h3 className="text-lg font-bold text-white uppercase">Nenhuma equipe pública encontrada</h3>
              <p className="text-xs mt-1">Cadastre a primeira equipe utilizando o assistente administrativo.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0d1215] p-6 transition-all hover:border-[#10b981]/50 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]"
                >
                  <div>
                    {/* Header: Crest & Team Name */}
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
                      {team.badgeUrl ? (
                        <img
                          src={team.badgeUrl}
                          alt={team.name}
                          className="h-14 w-14 rounded-2xl object-contain bg-black/40 p-1 border border-white/10 group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 font-mono font-black text-lg text-white uppercase shadow-inner"
                          style={{ backgroundColor: team.primaryColor || "#10b981" }}
                        >
                          {team.shortName || team.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/${team.slug}`}
                          className="font-mono text-lg font-black text-white hover:text-[#10b981] transition-colors truncate block uppercase tracking-tight"
                        >
                          {team.name}
                        </Link>
                        <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                          📍 {team.city || "Brasil"} {team.region ? `· ${team.region}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Team Details & Badges */}
                    <div className="space-y-2.5 text-xs font-mono">
                      <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3 border border-white/5">
                        <span className="text-slate-400 font-semibold">Superfície</span>
                        <span className="font-bold text-white">
                          {team.fieldType ? fieldTypeLabels[team.fieldType] : "Grama Sintética"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3 border border-white/5">
                        <span className="text-slate-400 font-semibold">Nível Competitivo</span>
                        <span className="font-bold text-emerald-400">
                          {team.competitiveLevel ? levelLabels[team.competitiveLevel] : "Intermediário"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center pt-1">
                        <div className="rounded-xl bg-white/[0.02] p-2 border border-white/5">
                          <span className="block text-base font-black text-white">{team._count.players}</span>
                          <span className="text-[9px] text-slate-400 uppercase font-bold">Atletas</span>
                        </div>
                        <div className="rounded-xl bg-white/[0.02] p-2 border border-white/5">
                          <span className="block text-base font-black text-white">{team._count.matches}</span>
                          <span className="text-[9px] text-slate-400 uppercase font-bold">Partidas</span>
                        </div>
                      </div>

                      {team.description && (
                        <p className="text-[11px] text-slate-400 italic leading-relaxed line-clamp-2 pt-1 font-sans">
                          "{team.description}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <Link
                      href={`/${team.slug}`}
                      className="w-full rounded-xl bg-white/5 hover:bg-[#10b981] hover:text-black border border-white/10 hover:border-[#10b981] px-4 py-3 text-xs font-mono font-black uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                    >
                      <span>Ver Arena do Time</span>
                      <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20 px-4">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-[#10b981]">
              ▸ Recursos Premium
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-mono tracking-tight">
              Tudo o Que Seu Time Precisa
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Ferramentas profissionais projetadas especificamente para a realidade de diretores, técnicos e atletas do futebol amador.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-[#0d1215] p-8 space-y-4 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-[#10b981] text-2xl font-black">
                🛡️
              </div>
              <h3 className="text-lg font-mono font-black text-white uppercase">Portal Público Exclusivo</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cada time recebe uma URL própria em <code className="text-[#10b981]">/[slug]</code> com camisa oficial, lista de convocados, artilharia e formulário de desafio.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0d1215] p-8 space-y-4 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 text-2xl font-black">
                📋
              </div>
              <h3 className="text-lg font-mono font-black text-white uppercase">Escalação Visual & Tática</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prancheta interativa Drag & Drop para montar o 11 inicial, definir titulares, reservas e formações (4-3-3, 4-4-2, 3-5-2).
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0d1215] p-8 space-y-4 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-[#10b981] text-2xl font-black">
                ⏱️
              </div>
              <h3 className="text-lg font-mono font-black text-white uppercase">Live Match Tracker</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Acompanhamento em tempo real durante a partida com cronômetro, registro de gols, assistências, cartões e súmula oficial PDF.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0d1215] p-8 space-y-4 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 text-2xl font-black">
                💰
              </div>
              <h3 className="text-lg font-mono font-black text-white uppercase">Financeiro & PIX</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cobrança de mensalidades e cotas de jogos via PIX com aprovação de comprovantes, fluxo de caixa e relatórios gerenciais.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0d1215] p-8 space-y-4 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 text-2xl font-black">
                ⚔️
              </div>
              <h3 className="text-lg font-mono font-black text-white uppercase">Diretório de Desafios</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Publique vagas de campos reservados ou encontre adversários amadores na sua região para marcar amistosos rapidamente.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0d1215] p-8 space-y-4 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 text-2xl font-black">
                ⭐
              </div>
              <h3 className="text-lg font-mono font-black text-white uppercase">Rankings & Avaliações</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Eleição automatizada de Craque do Jogo, ranking de artilharia, assistências, scout coletivo e histórico técnico do atleta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Team Creation Info Section */}
      <section className="py-16 px-4 bg-[#090d0f] border-t border-white/10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-[#0d1215] to-[#06090b] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1 text-xs font-mono font-bold uppercase tracking-widest text-[#10b981]">
              🚀 Solicitação de Nova Equipe
            </span>
            <h2 className="text-2xl sm:text-4xl font-mono font-black text-white uppercase tracking-tight">
              Quer Criar a Arena Digital do Seu Time?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-2xl">
              Nesta fase da plataforma, a criação de novas contas administrativas e times é realizada sob demanda diretamente por este assistente de IA. Entre em contato com a equipe de suporte para gerar o acesso do seu diretor e a URL pública da sua equipe!
            </p>
            <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#10b981] hover:bg-[#34d399] px-6 text-xs font-mono font-black uppercase tracking-wider text-black transition-all shadow-md"
              >
                Acessar Login de Diretor &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#040608] py-12 px-4 font-mono text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10b981] text-black font-black">
              V
            </div>
            <span className="font-bold text-white uppercase tracking-wider">
              VAR<span className="text-[#10b981]">zea</span> SaaS
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[11px] font-semibold text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <a href="#times" className="hover:text-white transition-colors">
              Times
            </a>
            <Link href="/vagas" className="hover:text-white transition-colors">
              Desafios (/vagas)
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Acesso Restrito
            </Link>
          </div>

          <p className="text-[10px] text-slate-500">
            &copy; {new Date().getFullYear()} VARzea. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
