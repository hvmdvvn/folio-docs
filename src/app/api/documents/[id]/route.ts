import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { assertCanEdit, assertOwner, getAccessibleDocument } from "@/lib/documents";
import { jsonError, jsonOk, HttpError } from "@/lib/http";

const updateSchema = z
  .object({
    title: z.string().trim().min(1).max(160).optional(),
    content: z.string().optional(),
  })
  .refine((value) => value.title !== undefined || value.content !== undefined, {
    message: "Nothing to update",
  });

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const doc = await getAccessibleDocument(id, user.id);
    if (!doc) {
      throw new HttpError("Document not found", 404);
    }
    return jsonOk(doc);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await assertCanEdit(id, user.id);
    const body = updateSchema.parse(await request.json());

    const updated = await prisma.document.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.content !== undefined ? { content: body.content } : {}),
      },
    });

    return jsonOk({
      id: updated.id,
      title: updated.title,
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await assertOwner(id, user.id);
    await prisma.document.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
