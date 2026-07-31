"use client";

import React from "react";
import { MatchPhotosGallery } from "@/components/dashboard/MatchPhotosGallery";

interface MatchGalleryTabProps {
  matchId: string;
  opponent: string;
}

export function MatchGalleryTab({ matchId, opponent }: MatchGalleryTabProps) {
  return <MatchPhotosGallery matchId={matchId} opponent={opponent} />;
}
