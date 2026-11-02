import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertOwner, getAccessibleDocument } from "@/lib/documents";
import { jsonError, jsonOk, HttpError } from "@/lib/http";

const shareSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await assertOwner(id, user.id);

    const body = shareSchema.parse(await request.json());
    const email = body.email.trim().toLowerCase();

    if (email === user.email.toLowerCase()) {
      throw new HttpError("You already own this document");
    }

    const target = await prisma.user.findUnique({ where: { email } });
    if (!target) {
      throw new HttpError(
        "No account found for that email. Try jordan@folio.dev or sam@folio.dev.",
        404,
      );
    }

    await prisma.documentShare.upsert({
      where: {
        documentId_userId: {
          documentId: id,
          userId: target.id,
        },
      },
      create: {
        documentId: id,
        userId: target.id,
      },
      update: {},
    });

    const doc = await getAccessibleDocument(id, user.id);
    return jsonOk({ document: doc });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await assertOwner(id, user.id);

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim().toLowerCase();
    if (!email) {
      throw new HttpError("email query param is required");
    }

    const target = await prisma.user.findUnique({ where: { email } });
    if (!target) {
      throw new HttpError("User not found", 404);
    }

    await prisma.documentShare.deleteMany({
      where: { documentId: id, userId: target.id },
    });

    const doc = await getAccessibleDocument(id, user.id);
    return jsonOk({ document: doc });
  } catch (error) {
    return jsonError(error);
  }
}
