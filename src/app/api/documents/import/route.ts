import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isAllowedImportName, markdownOrTextToHtml } from "@/lib/import-file";
import { jsonError, jsonOk, HttpError } from "@/lib/http";

const MAX_BYTES = 512 * 1024;

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      throw new HttpError("Choose a .txt or .md file to import");
    }

    if (!isAllowedImportName(file.name)) {
      throw new HttpError("Only .txt and .md files are supported");
    }

    if (file.size > MAX_BYTES) {
      throw new HttpError("File is too large (max 512 KB)");
    }

    const raw = await file.text();
    const content = markdownOrTextToHtml(raw, file.name);
    const title = file.name.replace(/\.(txt|md|markdown)$/i, "") || "Imported document";

    const doc = await prisma.document.create({
      data: {
        title,
        content,
        ownerId: user.id,
      },
    });

    return jsonOk(
      {
        id: doc.id,
        title: doc.title,
      },
      { status: 201 },
    );
  } catch (error) {
    return jsonError(error);
  }
}
