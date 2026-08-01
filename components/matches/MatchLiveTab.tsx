"use client";

import React from "react";
import { LiveMatchControl } from "@/components/dashboard/LiveMatchControl";

interface MatchLiveTabProps {
  matchId: string;
}

export function MatchLiveTab({ matchId }: MatchLiveTabProps) {
  return <LiveMatchControl matchId={matchId} />;
}
