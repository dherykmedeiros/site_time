import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  if (
    segments.length === 0 ||
    segments.some((segment) => !segment || segment === "." || segment === ".." || segment.includes("\\"))
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const uploadsDirectory = path.resolve(process.cwd(), "public", "uploads");
  const filePath = path.resolve(uploadsDirectory, ...segments);
  if (!filePath.startsWith(`${uploadsDirectory}${path.sep}`)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()];
  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await readFile(filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
