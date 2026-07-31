import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPlayerProfileData } from "@/lib/player-queries";
import { PlayerProfileLayout } from "@/components/squad/PlayerProfileLayout";

export default async function MyProfilePage() {
  const session = await getSession();

  if (!session?.user?.teamId) {
    return notFound();
  }

  const playerId = session.user.playerId;

  if (!playerId) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/90 px-8 py-12 text-center shadow-xl backdrop-blur-xl space-y-4">
        <span className="text-4xl inline-block">👤</span>
        <h1 className="text-2xl font-bold uppercase text-[var(--text)] tracking-tight">Sem perfil de atleta</h1>
        <p className="max-w-md mx-auto text-sm text-[var(--text-muted)] leading-relaxed">
          Sua conta de usuário ainda não está vinculada a nenhum jogador do elenco deste time. 
          Entre em contato com um administrador ou treinador do clube para vincular seu e-mail ao seu cadastro de atleta.
        </p>
      </div>
    );
  }

  const playerData = await getPlayerProfileData(playerId, session.user.teamId);

  if (!playerData) {
    return notFound();
  }

  const isCoachOrAdmin = session.user.role === "ADMIN" || session.user.role === "COACH";

  return (
    <PlayerProfileLayout
      playerData={playerData}
      isMe={true}
      isCoachOrAdmin={isCoachOrAdmin}
    />
  );
}
