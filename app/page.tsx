import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect(session.user.teamId ? "/squad" : "/team/settings");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_18%,rgba(58,120,99,0.17),transparent_35%),radial-gradient(circle_at_88%_0%,rgba(232,163,82,0.2),transparent_34%),linear-gradient(180deg,#f5f7f6_0%,#eef4f0_100%)]">
      <div className="pointer-events-none absolute -top-20 right-[-100px] h-72 w-72 rounded-full bg-[#b7dfd2]/55 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-[-80px] h-64 w-64 rounded-full bg-[#f4ddb7]/65 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 rounded-[34px] border border-[#c9ded6] bg-white/78 p-6 shadow-[0_28px_80px_rgba(16,68,57,0.12)] backdrop-blur sm:p-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2a6f60]">Plataforma VARzea</p>
            <h1 className="mt-3 text-balance font-display text-4xl font-bold leading-tight text-[#163e36] sm:text-5xl">
              Organize seu futebol de forma profissional sem perder a identidade da varzea.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-[#36544d] sm:text-base">
              Centralize elenco, partidas, financeiro, convocacoes e vitrine publica do time em um unico painel.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/vitrine"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#8eb8ab] bg-white px-6 text-sm font-semibold text-[#165347] transition hover:bg-[#f1faf6]"
              >
                Explorar vitrine
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#0a584b] px-6 text-sm font-semibold text-white transition hover:bg-[#084a3f]"
              >
                Entrar na area do time
              </Link>
            </div>
          </div>

          <div className="rounded-[26px] border border-[#d5e6df] bg-[#f7fbf9] p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4f746b]">O que voce encontra</p>
            <ul className="mt-4 space-y-3 text-sm text-[#355249] sm:text-base">
              <li className="rounded-xl border border-[#dcebe6] bg-white px-4 py-3">⚽ Agenda de jogos com RSVP por posicao</li>
              <li className="rounded-xl border border-[#dcebe6] bg-white px-4 py-3">👥 Gestao completa de elenco e convites</li>
              <li className="rounded-xl border border-[#dcebe6] bg-white px-4 py-3">📈 Rankings, estatisticas e retrospecto</li>
              <li className="rounded-xl border border-[#dcebe6] bg-white px-4 py-3">🌐 Vitrine publica para divulgar o time</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
