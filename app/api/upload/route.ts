import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { generateUUID } from "@/lib/utils";
import { rateLimitUpload } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const MAGIC_BYTES: Record<string, { bytes: number[]; ext: string }> = {
  jpeg: { bytes: [0xff, 0xd8, 0xff], ext: "jpg" },
  png: { bytes: [0x89, 0x50, 0x4e, 0x47], ext: "png" },
  webp: { bytes: [0x52, 0x49, 0x46, 0x46], ext: "webp" },
};

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const SUPABASE_STORAGE_ENDPOINT = process.env.SUPABASE_STORAGE_ENDPOINT;
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseStorageApiBase(endpoint: string): string {
  const normalized = endpoint.endsWith("/") ? endpoint.slice(0, -1) : endpoint;
  return normalized.endsWith("/storage/v1/s3")
    ? normalized.slice(0, -3)
    : normalized;
}

function canUseSupabaseStorage() {
  return (
    Boolean(SUPABASE_STORAGE_ENDPOINT) &&
    Boolean(SUPABASE_STORAGE_BUCKET) &&
    Boolean(SUPABASE_SERVICE_ROLE_KEY)
  );
}

async function uploadToSupabaseStorage(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  if (!SUPABASE_STORAGE_ENDPOINT || !SUPABASE_STORAGE_BUCKET || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase storage is not fully configured");
  }

  const storageApiBase = getSupabaseStorageApiBase(SUPABASE_STORAGE_ENDPOINT);
  const objectKey = `uploads/${fileName}`;
  const uploadUrl = `${storageApiBase}/object/${SUPABASE_STORAGE_BUCKET}/${objectKey}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": mimeType,
      "x-upsert": "false",
    },
    body: new Uint8Array(buffer),
  });

  if (!uploadResponse.ok) {
    const details = await uploadResponse.text().catch(() => "");
    throw new Error(`Storage upload failed (${uploadResponse.status}): ${details}`);
  }

  return `${storageApiBase}/object/public/${SUPABASE_STORAGE_BUCKET}/${objectKey}`;
}

async function uploadToLocalStorage(buffer: Buffer, fileName: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

function detectImageType(buffer: Buffer): string | null {
  for (const [, { bytes, ext }] of Object.entries(MAGIC_BYTES)) {
    if (bytes.every((b, i) => buffer[i] === b)) {
      // WebP needs additional check: bytes 8-11 should be "WEBP"
      if (ext === "webp") {
        const webpSignature = buffer.slice(8, 12).toString("ascii");
        if (webpSignature !== "WEBP") continue;
      }
      return ext;
    }
  }
  return null;
}

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  const ip = extractClientIp(request);
  const { allowed, retryAfterMinutes } = await rateLimitUpload(ip);
  if (!allowed) {
    return NextResponse.json(
      {
        error: `Muitas tentativas de upload. Tente novamente em ${retryAfterMinutes} minutos.`,
        code: "RATE_LIMITED",
      },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo é obrigatório" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo deve ter no máximo 5 MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = detectImageType(buffer);
    if (!ext) {
      return NextResponse.json(
        { error: "Formato inválido. Aceitos: JPEG, PNG, WebP" },
        { status: 400 }
      );
    }

    const fileName = `${generateUUID()}.${ext}`;
    const mimeType = MIME_BY_EXT[ext];

    // Re-encode through sharp to strip any embedded payloads
    let cleanBuffer: Buffer;
    try {
      if (ext === "png") {
        cleanBuffer = await sharp(buffer).png().toBuffer();
      } else if (ext === "webp") {
        cleanBuffer = await sharp(buffer).webp().toBuffer();
      } else {
        cleanBuffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
      }
    } catch {
      return NextResponse.json(
        { error: "Imagem corrompida ou inválida" },
        { status: 400 }
      );
    }

    const url = canUseSupabaseStorage()
      ? await uploadToSupabaseStorage(cleanBuffer, fileName, mimeType)
      : await uploadToLocalStorage(cleanBuffer, fileName);

    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    console.error("Upload failed", err);
    return NextResponse.json(
      { error: "Falha ao processar upload" },
      { status: 500 }
    );
  }
}
