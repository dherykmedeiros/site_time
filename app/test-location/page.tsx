"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export default function TestLocationPage() {
  const [permissionStatus, setPermissionStatus] = useState<string>("loading");
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Target coordinates for test simulation
  const [targetLat, setTargetLat] = useState<string>("-22.9121"); // Default to Maracanã stadium
  const [targetLon, setTargetLon] = useState<string>("-43.2302");
  const [targetLabel, setTargetLabel] = useState<string>("Estádio do Maracanã (RJ)");

  // Distance calculation state
  const [distance, setDistance] = useState<number | null>(null);

  // Query browser permissions API if supported
  const checkPermissionState = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.permissions) {
      setPermissionStatus("unknown");
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: "geolocation" as PermissionName });
      setPermissionStatus(result.state);
      
      // Listen for permission status changes
      result.onchange = () => {
        setPermissionStatus(result.state);
      };
    } catch (err) {
      console.warn("Permissions API not supported for geolocation on this browser:", err);
      setPermissionStatus("unknown");
    }
  }, []);

  useEffect(() => {
    checkPermissionState();
  }, [checkPermissionState]);

  // Haversine formula to calculate distance in meters
  const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Trigger location request
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocalização não é suportada neste navegador ou requer conexão segura (HTTPS).");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const data: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp).toLocaleTimeString("pt-BR"),
        };
        setCurrentLocation(data);
        setIsLoading(false);
        checkPermissionState(); // update status
      },
      (error) => {
        setIsLoading(false);
        checkPermissionState(); // update status
        
        let msg = "Erro ao obter localização.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Permissão negada pelo usuário ou bloqueada pelas políticas de cabeçalho do servidor.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "As informações de localização estão indisponíveis no dispositivo.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Tempo limite esgotado ao tentar obter a localização.";
        }
        setErrorMsg(`${msg} (Detalhes: ${error.message})`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Copy current location to simulation targets
  const copyCurrentToTarget = () => {
    if (!currentLocation) return;
    setTargetLat(currentLocation.latitude.toFixed(6));
    setTargetLon(currentLocation.longitude.toFixed(6));
    setTargetLabel("Minha Posição Atual");
  };

  // Set preset destinations for testing
  const setPreset = (label: string, lat: string, lon: string) => {
    setTargetLat(lat);
    setTargetLon(lon);
    setTargetLabel(label);
  };

  // Recalculate distance whenever current location or target changes
  useEffect(() => {
    if (!currentLocation) {
      setDistance(null);
      return;
    }

    const tLat = parseFloat(targetLat);
    const tLon = parseFloat(targetLon);

    if (isNaN(tLat) || isNaN(tLon)) {
      setDistance(null);
      return;
    }

    const dist = getDistanceInMeters(
      currentLocation.latitude,
      currentLocation.longitude,
      tLat,
      tLon
    );
    setDistance(dist);
  }, [currentLocation, targetLat, targetLon]);

  const isWithinRange = distance !== null && distance <= 500;

  return (
    <div className="min-h-screen bg-[#030708] text-white font-sans selection:bg-[#10b981] selection:text-black">
      {/* Dynamic ambient header background */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[rgba(16,185,129,0.08)] via-[rgba(16,185,129,0.01)] to-transparent pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 py-10 sm:px-6">
        
        {/* Navigation back link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#10b981] hover:text-[#34d399] transition-colors font-medium group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span> Voltar para o Portal
          </Link>
        </div>

        {/* Hero Section */}
        <header className="mb-10 text-center sm:text-left">
          <span className="inline-flex rounded-full bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#34d399] font-mono mb-4">
            Painel de Teste e Validação
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Diagnóstico de Localização & Check-in
          </h1>
          <p className="mt-3 text-slate-400 text-base max-w-2xl">
            Esta página auxilia na validação do sistema de geolocalização dos atletas para confirmação de presença real a menos de 500 metros do campo de jogo.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN: Status and current geolocation */}
          <div className="space-y-6">
            
            {/* Permission Status Box */}
            <div className="border border-white/[0.08] bg-[#0b0f11] rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[rgba(16,185,129,0.03)] rounded-full blur-xl pointer-events-none" />
              
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🔒</span> Permissão no Navegador
              </h2>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-sm text-slate-400 font-mono">Status da API</span>
                <span className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                  permissionStatus === "granted"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : permissionStatus === "denied"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : permissionStatus === "prompt"
                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                }`}>
                  {permissionStatus === "granted" && "Concedida"}
                  {permissionStatus === "denied" && "Negada / Bloqueada"}
                  {permissionStatus === "prompt" && "Perguntar (Prompt)"}
                  {permissionStatus === "loading" && "Carregando..."}
                  {permissionStatus === "unknown" && "Indeterminada"}
                </span>
              </div>

              {permissionStatus === "denied" && (
                <div className="mt-4 p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-200 leading-relaxed">
                  ⚠️ A geolocalização está bloqueada nas configurações. Clique no ícone de <strong>cadeado/configurações</strong> na barra de endereços do seu navegador e altere a permissão para &quot;Permitir&quot;.
                </div>
              )}
            </div>

            {/* Current Location Box */}
            <div className="border border-white/[0.08] bg-[#0b0f11] rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📍</span> Minha Localização Atual
              </h2>

              <div className="space-y-4">
                <button
                  onClick={requestLocation}
                  disabled={isLoading}
                  className="w-full relative flex items-center justify-center gap-2.5 min-h-[50px] rounded-xl border border-black bg-[#10b981] hover:bg-[#059669] text-[#010403] font-bold text-sm transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-[#010403]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Obtendo Coordenadas...
                    </>
                  ) : (
                    <>
                      <span>📡</span> Solicitar Localização Real
                    </>
                  )}
                </button>

                {errorMsg && (
                  <div className="p-4 bg-red-950/30 border border-red-500/20 text-red-200 rounded-xl text-xs leading-relaxed whitespace-pre-wrap">
                    <strong>Falha:</strong> {errorMsg}
                  </div>
                )}

                {currentLocation ? (
                  <div className="space-y-2.5 text-sm font-mono pt-2">
                    <div className="flex justify-between border-b border-white/[0.04] pb-2">
                      <span className="text-slate-400">Latitude</span>
                      <span className="text-white font-bold">{currentLocation.latitude.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.04] pb-2">
                      <span className="text-slate-400">Longitude</span>
                      <span className="text-white font-bold">{currentLocation.longitude.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.04] pb-2">
                      <span className="text-slate-400">Precisão</span>
                      <span className="text-[#34d399] font-bold">± {currentLocation.accuracy.toFixed(1)} metros</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-slate-400">Atualizado em</span>
                      <span className="text-slate-300">{currentLocation.timestamp}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                    <p className="text-xs text-slate-400">
                      Nenhuma coordenada capturada ainda. Clique no botão acima para iniciar a leitura.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Target Simulation & Distance checking */}
          <div className="space-y-6">
            
            {/* Target Coordinate / Field Settings */}
            <div className="border border-white/[0.08] bg-[#0b0f11] rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">🥅 Ponto de Destino (Campo)</span>
                {currentLocation && (
                  <button
                    onClick={copyCurrentToTarget}
                    className="text-xs font-semibold text-[#10b981] hover:text-[#34d399] transition-colors"
                  >
                    Usar Minha Posição
                  </button>
                )}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Nome / Identificação do Local
                  </label>
                  <input
                    type="text"
                    value={targetLabel}
                    onChange={(e) => setTargetLabel(e.target.value)}
                    className="w-full h-10 px-3.5 bg-black border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#10b981] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={targetLat}
                      onChange={(e) => setTargetLat(e.target.value)}
                      className="w-full h-10 px-3.5 bg-black border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-[#10b981] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={targetLon}
                      onChange={(e) => setTargetLon(e.target.value)}
                      className="w-full h-10 px-3.5 bg-black border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-[#10b981] transition-colors"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-2">
                  <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Simular Locais Famosos:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setPreset("Estádio do Maracanã (RJ)", "-22.9121", "-43.2302")}
                      className="text-xs bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 hover:bg-white/[0.08] transition-colors"
                    >
                      🇧🇷 Maracanã
                    </button>
                    <button
                      onClick={() => setPreset("Neo Química Arena (SP)", "-23.5452", "-46.4741")}
                      className="text-xs bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 hover:bg-white/[0.08] transition-colors"
                    >
                      🏟️ Arena Corinthians
                    </button>
                    <button
                      onClick={() => setPreset("Allianz Parque (SP)", "-23.5273", "-46.6785")}
                      className="text-xs bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 hover:bg-white/[0.08] transition-colors"
                    >
                      ⚽ Allianz Parque
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Match & Verification Results */}
            <div className="border border-white/[0.08] bg-[#0b0f11] rounded-2xl p-6 shadow-xl relative overflow-hidden">
              
              {/* Proximity visual alert indicator bar */}
              {distance !== null && (
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                  isWithinRange ? "bg-emerald-500" : "bg-red-500"
                }`} />
              )}

              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🔄</span> Resultado do Check-in
              </h2>

              {distance !== null ? (
                <div className="space-y-5">
                  <div className="text-center py-4 bg-white/[0.01] rounded-xl border border-white/[0.04]">
                    <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Distância Calculada</p>
                    <p className="text-4xl font-extrabold text-white mt-1.5 font-mono">
                      {distance < 1000
                        ? `${Math.round(distance)}m`
                        : `${(distance / 1000).toFixed(2)}km`}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Destino: {targetLabel}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border flex gap-3.5 items-start ${
                    isWithinRange
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-100"
                      : "bg-red-500/10 border-red-500/20 text-red-100"
                  }`}>
                    <span className="text-2xl mt-0.5">{isWithinRange ? "✅" : "❌"}</span>
                    <div>
                      <h4 className="font-bold text-sm">
                        {isWithinRange ? "Status: Elegível para Check-in" : "Status: Bloqueado (Muito longe)"}
                      </h4>
                      <p className="text-xs opacity-80 mt-1 leading-relaxed">
                        {isWithinRange
                          ? "Você está a menos de 500 metros do local do jogo. O check-in funcionaria normalmente na plataforma."
                          : "A distância é superior ao limite permitido de 500 metros. O servidor recusaria o check-in automático."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                  <p className="text-sm text-slate-400 px-4">
                    Obtenha sua localização atual clicando em <strong>📡 Solicitar Localização Real</strong> para iniciar a simulação de distância.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Diagnostic Guide Accordion */}
        <section className="mt-10 border border-white/[0.08] bg-[#0b0f11] rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>⚙️</span> Guia de Resolução de Problemas
          </h3>

          <div className="space-y-4 text-sm text-slate-400">
            <div className="border-b border-white/[0.04] pb-4">
              <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                <span className="text-[#34d399] font-mono">1.</span> O navegador não exibe o prompt de permissão?
              </h4>
              <p className="leading-relaxed text-xs">
                Acabamos de ajustar o cabeçalho <code>Permissions-Policy</code> no servidor para liberar o uso da geolocalização. No entanto, se você já tiver negado a permissão no passado, o navegador salvará essa escolha. Para corrigir:
              </p>
              <ul className="list-disc list-inside mt-2 text-xs pl-2 space-y-1">
                <li>No <strong>Google Chrome</strong> ou <strong>Brave</strong>: Clique no ícone de <strong>cadeado ou controles</strong> ao lado esquerdo da URL e selecione &quot;Permitir&quot; para Localização.</li>
                <li>No <strong>Safari (iOS/macOS)</strong>: Vá em Ajustes do Sistema &gt; Safari &gt; Localização e marque &quot;Permitir&quot; ou &quot;Perguntar&quot;.</li>
                <li>No <strong>Firefox</strong>: Clique no ícone de permissão na barra de endereços (próximo à URL) e remova a exclusão para recriar o prompt.</li>
              </ul>
            </div>

            <div className="border-b border-white/[0.04] pb-4">
              <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                <span className="text-[#34d399] font-mono">2.</span> Erro de conexão segura (HTTPS)?
              </h4>
              <p className="leading-relaxed text-xs">
                A API de Geolocalização (<code>navigator.geolocation</code>) é um recurso seguro. Ela <strong>só funciona</strong> em conexões seguras (<code>https://</code>) ou no ambiente local (<code>http://localhost</code>). Se a aplicação for acessada por um endereço HTTP que não seja localhost (ex: IP de rede local), a API não funcionará.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                <span className="text-[#34d399] font-mono">3.</span> Precisão da localização baixa?
              </h4>
              <p className="leading-relaxed text-xs">
                Em computadores de mesa (desktops) sem chip GPS ou Wi-Fi ativo, a geolocalização é estimada pelo endereço de IP, o que pode dar um erro de vários quilômetros. Para obter precisão perfeita e testar o limite de 500m de forma real, utilize um smartphone com o sinal de GPS ativo.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
