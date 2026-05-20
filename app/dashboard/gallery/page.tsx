"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

interface Uploader {
  id: string;
  name: string;
}

interface MatchRef {
  id: string;
  opponent: string;
  date: string;
}

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  uploadedById: string;
  uploadedBy: Uploader;
  match: MatchRef;
  createdAt: string;
}

interface MatchOption {
  id: string;
  opponent: string;
  date: string;
}

export default function GeneralGalleryPage() {
  const { data: session } = useSession();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [matches, setMatches] = useState<MatchOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Lightbox Modal State
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Load matches options for filtering
  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await fetch("/api/matches");
        if (res.ok) {
          const data = await res.json();
          // Filter out matches that don't have opponent details
          const list = Array.isArray(data.matches) ? data.matches : [];
          setMatches(
            list.map((m: any) => ({
              id: m.id,
              opponent: m.opponent,
              date: m.date,
            }))
          );
        }
      } catch (err) {
        console.error("Erro ao carregar partidas para o filtro:", err);
      }
    }
    loadMatches();
  }, []);

  // Fetch photos based on match filter
  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = selectedMatchId
        ? `/api/gallery?matchId=${selectedMatchId}`
        : "/api/gallery";

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Erro ao carregar as fotos da galeria.");
      }
      const data = await res.json();
      setPhotos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar fotos");
    } finally {
      setLoading(false);
    }
  }, [selectedMatchId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Client-side date filter logic (matching match date or upload date)
  const filteredPhotos = photos.filter((photo) => {
    if (!selectedDate) return true;
    
    // Compare YYYY-MM-DD format of match date or upload date
    const photoDateStr = new Date(photo.match.date).toISOString().split("T")[0];
    return photoDateStr === selectedDate;
  });

  const handleDeletePhoto = async (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Tem certeza que deseja deletar esta foto da galeria?")) return;

    try {
      const res = await fetch(`/api/matches/${photo.match.id}/photos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: photo.id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao deletar foto");
      }

      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      if (selectedPhoto?.id === photo.id) {
        setSelectedPhoto(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao deletar");
    }
  };

  const handleDownload = async (photo: Photo, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `galeria_time_${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      window.open(photo.url, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card className="border-[#10b981]/15 bg-black/40 backdrop-blur-md">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:max-w-2xl">
              {/* Match Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#8fa39b] font-mono">
                  Filtrar por Jogo
                </label>
                <select
                  value={selectedMatchId}
                  onChange={(e) => setSelectedMatchId(e.target.value)}
                  className="w-full rounded-xl border border-[#10b981]/25 bg-black/60 px-4 py-2.5 text-sm font-semibold text-white focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]"
                >
                  <option value="">Todos os Jogos</option>
                  {matches.map((m) => (
                    <option key={m.id} value={m.id}>
                      {new Date(m.date).toLocaleDateString("pt-BR")} - vs {m.opponent}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#8fa39b] font-mono">
                  Filtrar por Data do Jogo
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-[#10b981]/25 bg-[#090f0c] px-4 py-2.5 text-sm font-semibold text-white focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] font-mono"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {(selectedMatchId || selectedDate) && (
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedMatchId("");
                  setSelectedDate("");
                }}
                className="w-full md:w-auto border-[#10b981]/20 hover:bg-[#10b981]/15 text-[#34d399] font-mono"
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 font-mono">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="aspect-square relative rounded-xl overflow-hidden border border-white/5 bg-white/5">
              <Skeleton className="absolute inset-0 bg-white/10" />
            </div>
          ))}
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#10b981]/15 bg-black/20 p-16 text-center text-[#8fa39b] font-mono">
          📸 Nenhuma foto encontrada com os filtros selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPhotos.map((photo) => {
            const isOwner = session?.user?.id === photo.uploadedById;
            const isStaff = session?.user?.role === "ADMIN" || session?.user?.role === "COACH";
            const canDelete = isOwner || isStaff;

            return (
              <div
                key={photo.id}
                onClick={() => {
                  setSelectedPhoto(photo);
                  setZoomLevel(1);
                }}
                className="group aspect-square relative rounded-xl overflow-hidden border border-[#10b981]/10 bg-black/50 cursor-pointer transition-all duration-300 hover:border-[#10b981]/30 hover:shadow-neon hover:scale-[1.02]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption || "Foto da partida"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Glassmorphic hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-3 space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#34d399] font-semibold truncate">
                    vs {photo.match.opponent}
                  </p>
                  <p className="text-xs font-bold text-white font-mono truncate">
                    Por {photo.uploadedBy.name}
                  </p>
                  <div className="flex justify-between items-center text-[9px] text-[#8fa39b] font-mono pt-1">
                    <span>{new Date(photo.match.date).toLocaleDateString("pt-BR")}</span>
                    <Link
                      href={`/dashboard/matches/${photo.match.id}`}
                      className="text-[#34d399] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ver Jogo ➜
                    </Link>
                  </div>
                </div>

                {/* Delete button (only uploader or staff) */}
                {canDelete && (
                  <button
                    onClick={(e) => handleDeletePhoto(photo, e)}
                    className="absolute top-2 right-2 rounded-full bg-red-500/80 p-1.5 text-white opacity-0 hover:bg-red-600 transition-opacity duration-200 group-hover:opacity-100 shadow-md"
                    title="Excluir foto"
                    aria-label="Excluir foto"
                  >
                    🗑️
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="text-white font-mono text-xs bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
              <span className="text-[#34d399] font-bold">vs {selectedPhoto.match.opponent}</span>
              <span className="text-gray-500">|</span>
              <span>Por {selectedPhoto.uploadedBy.name}</span>
              <span className="text-gray-500">|</span>
              <span>{new Date(selectedPhoto.match.date).toLocaleDateString("pt-BR")}</span>
            </div>
            
            <div className="flex gap-2">
              <Link
                href={`/dashboard/matches/${selectedPhoto.match.id}`}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white border border-white/10 hover:bg-white/20 font-mono transition flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                ⚽ Ir para o Jogo
              </Link>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/10 text-white border-white/10 hover:bg-white/20 font-mono"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
                }}
              >
                🔍 Zoom ({zoomLevel}x)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/10 text-white border-white/10 hover:bg-white/20 font-mono"
                onClick={(e) => handleDownload(selectedPhoto, e)}
              >
                💾 Baixar
              </Button>
              <button
                className="rounded-full bg-white/10 p-2 text-white border border-white/10 hover:bg-white/20 text-sm leading-none"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Lightbox Main Image */}
          <div
            className="flex-1 flex items-center justify-center overflow-hidden max-w-full max-h-full transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || "Visualização ampliada"}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10"
            />
          </div>

          {/* Caption */}
          {selectedPhoto.caption && (
            <p className="mt-4 text-center text-sm text-[#8fa39b] max-w-lg font-mono z-10 bg-black/60 px-4 py-2 rounded-full border border-white/5">
              {selectedPhoto.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
