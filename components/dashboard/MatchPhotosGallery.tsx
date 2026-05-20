"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

interface Uploader {
  id: string;
  name: string;
}

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  uploadedById: string;
  uploadedBy: Uploader;
  createdAt: string;
}

interface MatchPhotosGalleryProps {
  matchId: string;
  opponent: string;
}

export function MatchPhotosGallery({ matchId, opponent }: MatchPhotosGalleryProps) {
  const { data: session } = useSession();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches/${matchId}/photos`);
      if (!res.ok) {
        throw new Error("Falha ao carregar as fotos.");
      }
      const data = await res.json();
      setPhotos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar fotos");
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem (JPEG, PNG, WebP).");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", `Foto do jogo contra ${opponent}`);

    try {
      const res = await fetch(`/api/matches/${matchId}/photos`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha ao enviar a foto.");
      }

      // Add newly uploaded photo to the list
      setPhotos((prev) => [data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleDeletePhoto = async (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening lightbox
    if (!confirm("Tem certeza que deseja deletar esta foto?")) return;

    try {
      const res = await fetch(`/api/matches/${matchId}/photos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao deletar a foto.");
      }

      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      if (selectedPhoto?.id === photoId) {
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
      a.download = `jogo_vs_${opponent.replace(/\s+/g, "_")}_${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      // Fallback in case of CORS restriction
      window.open(photo.url, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#10b981]/15 bg-black/40">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Galeria de Fotos</h2>
              <p className="text-sm text-[#8fa39b] font-mono">
                Compartilhe e reveja os melhores lances do jogo contra {opponent}
              </p>
            </div>
            <div>
              <label className="relative flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#10b981] px-4 py-2 text-sm font-semibold text-[#030708] hover:bg-[#34d399] transition font-mono">
                📷 Adicionar Foto
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400 font-mono">
              ⚠️ {error}
            </div>
          )}

          {/* Drag & Drop Upload Zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative flex min-h-[140px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
              dragActive
                ? "border-[#10b981] bg-[#10b981]/5 shadow-neon"
                : "border-[#10b981]/15 bg-white/[0.02] hover:bg-white/[0.04]"
            }`}
          >
            {uploading ? (
              <div className="space-y-2 flex flex-col items-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#10b981] border-t-transparent" />
                <p className="text-sm text-[#34d399] font-mono font-medium">Otimizando e enviando foto...</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-base font-semibold text-white font-mono">Arrastar e soltar foto aqui</p>
                <p className="text-xs text-[#8fa39b] font-mono">Ou selecione pelo botão de upload acima (JPEG, PNG, WebP de até 5MB)</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grid of Photos */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-video relative rounded-lg overflow-hidden border border-white/5 bg-white/5">
              <Skeleton className="absolute inset-0 bg-white/10" />
            </div>
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="rounded-xl border border-[#10b981]/10 bg-black/20 p-12 text-center text-[#8fa39b] font-mono">
          📸 Nenhuma foto foi adicionada a esta partida ainda. Seja o primeiro a registrar a resenha!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo) => {
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
                className="group aspect-square relative rounded-xl overflow-hidden border border-[#10b981]/10 bg-black/50 cursor-pointer transition-all duration-300 hover:border-[#10b981]/30 hover:shadow-neon"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption || "Foto da partida"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Hover overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-3">
                  <p className="text-xs font-bold text-white font-mono truncate">
                    Por {photo.uploadedBy.name}
                  </p>
                  <p className="text-[10px] text-[#8fa39b] font-mono">
                    {new Date(photo.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                {/* Delete button (only uploader, coach or admin) */}
                {canDelete && (
                  <button
                    onClick={(e) => handleDeletePhoto(photo.id, e)}
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
            <div className="text-white font-mono text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              Enviada por {selectedPhoto.uploadedBy.name} em {new Date(selectedPhoto.createdAt).toLocaleDateString("pt-BR")}
            </div>
            <div className="flex gap-2">
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
