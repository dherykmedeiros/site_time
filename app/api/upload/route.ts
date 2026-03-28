import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { generateUUID } from "@/lib/utils";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const MAGIC_BYTES: Record<string, { bytes: number[]; ext: string }> = {
  jpeg: { bytes: [0xff, 0xd8, 0xff], ext: "jpg" },
  png: { bytes: [0x89, 0x50, 0x4e, 0x47], ext: "png" },
  webp: { bytes: [0x52, 0x49, 0x46, 0x46], ext: "webp" },
};

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
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${fileName}` }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Falha ao processar upload" },
      { status: 500 }
    );
  }
}
