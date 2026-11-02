import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { listDocumentsForUser } from "@/lib/documents";
import { jsonError, jsonOk } from "@/lib/http";

const createSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  content: z.string().optional(),
});

export async function GET() {
  try {
    const user = await requireUser();
    const lists = await listDocumentsForUser(user.id);
    return jsonOk(lists);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = createSchema.parse(await request.json().catch(() => ({})));
    const doc = await prisma.document.create({
      data: {
        title: body.title?.trim() || "Untitled document",
        content: body.content ?? "<p></p>",
        ownerId: user.id,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        shares: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    return jsonOk(
      {
        id: doc.id,
        title: doc.title,
        content: doc.content,
        relation: "owned" as const,
        owner: doc.owner,
        sharedWith: [],
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
        canEdit: true,
        canShare: true,
      },
      { status: 201 },
    );
  } catch (error) {
    return jsonError(error);
  }
}
