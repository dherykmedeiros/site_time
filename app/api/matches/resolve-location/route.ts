import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { resolveGoogleMapsUrl, extractCoordsFromGoogleMaps } from "@/lib/utils";

// POST /api/matches/resolve-location — Resolve coordenadas de uma URL ou texto de localização em tempo real
export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json({ error: "URL ou coordenadas não informadas" }, { status: 400 });
    }

    const cleanInput = url.trim();

    // 1. Tenta extrair diretamente primeiro (caso seja lat,lon, DMS ou URL completa)
    let coords = extractCoordsFromGoogleMaps(cleanInput);
    let resolvedUrl = cleanInput;

    // 2. Se não extraiu direto e parece uma URL (ex: maps.app.goo.gl), resolve no servidor
    if (!coords && /^https?:\/\//i.test(cleanInput)) {
      resolvedUrl = await resolveGoogleMapsUrl(cleanInput);
      coords = extractCoordsFromGoogleMaps(resolvedUrl);
    }

    if (!coords) {
      return NextResponse.json(
        {
          error: "Não foi possível extrair a localização. Verifique o link ou formato das coordenadas.",
          code: "LOCATION_NOT_FOUND",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      latitude: coords.latitude,
      longitude: coords.longitude,
      resolvedUrl,
      formattedCoords: `${coords.latitude}, ${coords.longitude}`,
      googleMapsSearchUrl: `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`,
    });
  } catch (err) {
    console.error("Erro ao resolver localização:", err);
    return NextResponse.json(
      { error: "Falha ao processar link de localização", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
