"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { playerPositionLabels } from "@/lib/player-positions";

interface SelfProfile {
  id: string;
  name: string;
  fullName: string | null;
  position: string;
  shirtNumber: number;
  status: "ACTIVE" | "INACTIVE";
  photoUrl: string | null;
  age: number | null;
  phone: string | null;
  description: string | null;
}

export function PlayerSelfProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [profile, setProfile] = useState<SelfProfile | null>(null);

  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  function handleInputValueChange(
    setter: (value: string) => void
  ): InputHTMLAttributes<HTMLInputElement>["onChange"] {
    return (event: ChangeEvent<HTMLInputElement>) => setter(event.target.value);
  }

  function handleTextareaValueChange(
    setter: (value: string) => void
  ): TextareaHTMLAttributes<HTMLTextAreaElement>["onChange"] {
    return (event: ChangeEvent<HTMLTextAreaElement>) => setter(event.target.value);
  }

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setErrorMsg(null);

      try {
        const res = await fetch("/api/players/me");
        if (res.status === 404) {
          setProfile(null);
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || "Erro ao carregar perfil");
          return;
        }

        setProfile(data);
        setFullName(data.fullName || "");
        setPhotoUrl(data.photoUrl || null);
        setAge(data.age != null ? String(data.age) : "");
        setPhone(data.phone || "");
        setDescription(data.description || "");
      } catch {
        setErrorMsg("Erro de conexao");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao enviar foto");
        return;
      }

      setPhotoUrl(data.url);
      setSuccessMsg("Foto enviada com sucesso. Clique em Salvar para confirmar.");
    } catch {
      setErrorMsg("Erro de conexao no upload");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      fullName: fullName.trim() || null,
      photoUrl,
      age: age.trim() ? Number(age) : null,
      phone: phone.trim() || null,
      description: description.trim() || null,
    };

    try {
      const res = await fetch("/api/players/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao salvar perfil");
        return;
      }

      setProfile(data);
      setSuccessMsg("Perfil atualizado com sucesso.");
    } catch {
      setErrorMsg("Erro de conexao");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card className="rounded-[18px]">
        <CardContent className="py-8">
          <p className="text-sm text-[var(--text-muted)]">Carregando meu perfil...</p>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Card className="rounded-[18px] border border-[#b7d8ce]">
      <CardHeader>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Meu perfil</p>
          <h2 className="text-lg font-bold text-[var(--text)]">Atualize seus dados basicos</h2>
        </div>
      </CardHeader>
      <CardContent>
        {errorMsg && (
          <div className="mb-4 rounded-[12px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[var(--danger)]">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-[12px] border border-[#bde0d3] bg-[#e9f8f1] p-3 text-sm text-[#1d5f4f]">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nome de jogador (administracao)" value={profile.name} disabled readOnly />
            <Input
              label="Posicao (administracao)"
              value={playerPositionLabels[profile.position as keyof typeof playerPositionLabels] || profile.position}
              disabled
              readOnly
            />
            <Input label="Numero (administracao)" value={`#${profile.shirtNumber}`} disabled readOnly />
            <Input
              label="Status (administracao)"
              value={profile.status === "ACTIVE" ? "Ativo" : "Inativo"}
              disabled
              readOnly
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nome completo"
              value={fullName}
              onChange={handleInputValueChange(setFullName)}
              maxLength={120}
              placeholder="Seu nome completo"
            />
            <Input
              label="Idade"
              type="number"
              min={10}
              max={99}
              value={age}
              onChange={handleInputValueChange(setAge)}
              placeholder="Ex: 28"
            />
          </div>

          <Input
            label="Telefone"
            value={phone}
            onChange={handleInputValueChange(setPhone)}
            maxLength={30}
            placeholder="Ex: (11) 99999-9999"
          />

          <Textarea
            label="Descricao"
            value={description}
            onChange={handleTextareaValueChange(setDescription)}
            maxLength={500}
            placeholder="Fale um pouco sobre voce no time"
            rows={4}
          />

          <div className="space-y-2">
            <p className="text-sm font-semibold text-[var(--text)]">Foto</p>
            <div className="flex flex-wrap items-center gap-4">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Foto do jogador"
                  className="h-16 w-16 rounded-full border border-[var(--border)] object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-[var(--border)] text-xl text-[var(--text-subtle)]">
                  👤
                </div>
              )}

              <label className="cursor-pointer">
                <span className="inline-flex items-center rounded-[10px] border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)]">
                  {uploadingPhoto ? "Enviando..." : "Alterar foto"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
              </label>
              <p className="text-xs text-[var(--text-subtle)]">JPEG, PNG ou WebP. Maximo 5 MB.</p>
            </div>
          </div>

          <div className="pt-1">
            <Button type="submit" disabled={saving || uploadingPhoto}>
              {saving ? "Salvando..." : "Salvar meu perfil"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
