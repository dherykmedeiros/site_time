import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPlayerProfileData } from "@/lib/player-queries";
import { PlayerProfileLayout } from "@/components/squad/PlayerProfileLayout";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerProfilePage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.user?.teamId) {
    return notFound();
  }

  const playerData = await getPlayerProfileData(id, session.user.teamId);

  if (!playerData) {
    return notFound();
  }

  const isCoachOrAdmin = session.user.role === "ADMIN" || session.user.role === "COACH";
  const isMe = session.user.playerId === id;

  return (
    <PlayerProfileLayout
      playerData={playerData}
      isMe={isMe}
      isCoachOrAdmin={isCoachOrAdmin}
    />
  );
}
