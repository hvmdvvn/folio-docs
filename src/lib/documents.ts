import { prisma } from "./db";
import { AuthError } from "./auth";

export async function listDocumentsForUser(userId: string) {
  const owned = await prisma.document.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      shares: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  const shared = await prisma.document.findMany({
    where: {
      shares: { some: { userId } },
      NOT: { ownerId: userId },
    },
    orderBy: { updatedAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      shares: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  return {
    owned: owned.map((doc) => serializeDocument(doc, "owned")),
    shared: shared.map((doc) => serializeDocument(doc, "shared")),
  };
}

export async function getAccessibleDocument(documentId: string, userId: string) {
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      shares: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  if (!doc) return null;

  const isOwner = doc.ownerId === userId;
  const isShared = doc.shares.some((share) => share.userId === userId);
  if (!isOwner && !isShared) return null;

  return {
    ...serializeDocument(doc, isOwner ? "owned" : "shared"),
    content: doc.content,
    canEdit: true,
    canShare: isOwner,
  };
}

export async function assertCanEdit(documentId: string, userId: string) {
  const access = await getAccessibleDocument(documentId, userId);
  if (!access) {
    throw new AuthError("Document not found or access denied");
  }
  return access;
}

export async function assertOwner(documentId: string, userId: string) {
  const doc = await prisma.document.findUnique({ where: { id: documentId } });
  if (!doc || doc.ownerId !== userId) {
    throw new AuthError("Only the owner can manage sharing");
  }
  return doc;
}

function serializeDocument(
  doc: {
    id: string;
    title: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    owner: { id: string; name: string; email: string };
    shares: { user: { id: string; name: string; email: string } }[];
  },
  relation: "owned" | "shared",
) {
  return {
    id: doc.id,
    title: doc.title,
    ownerId: doc.ownerId,
    relation,
    owner: doc.owner,
    sharedWith: doc.shares.map((share) => share.user),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
