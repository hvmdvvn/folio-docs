import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("folio123", 10);

  const maya = await prisma.user.upsert({
    where: { email: "maya@folio.dev" },
    update: {},
    create: {
      email: "maya@folio.dev",
      name: "Maya Chen",
      passwordHash,
    },
  });

  const jordan = await prisma.user.upsert({
    where: { email: "jordan@folio.dev" },
    update: {},
    create: {
      email: "jordan@folio.dev",
      name: "Jordan Blake",
      passwordHash,
    },
  });

  const sam = await prisma.user.upsert({
    where: { email: "sam@folio.dev" },
    update: {},
    create: {
      email: "sam@folio.dev",
      name: "Sam Okonkwo",
      passwordHash,
    },
  });

  const existing = await prisma.document.findFirst({
    where: { ownerId: maya.id, title: "Product kickoff notes" },
  });

  if (!existing) {
    const kickoff = await prisma.document.create({
      data: {
        title: "Product kickoff notes",
        ownerId: maya.id,
        content: `
          <h1>Product kickoff</h1>
          <p>Scope for the collaborative writing pilot. Keep this short enough that someone can skim it in two minutes.</p>
          <h2>What we are shipping</h2>
          <ul>
            <li>Create, rename, and edit documents with basic rich text</li>
            <li>Import plain text and Markdown into a new draft</li>
            <li>Share a document with another teammate by email</li>
          </ul>
          <h2>What we are not shipping yet</h2>
          <ol>
            <li>Realtime cursors</li>
            <li>Comments / suggestions</li>
            <li>Version history</li>
          </ol>
          <p><strong>Owner:</strong> Maya &nbsp;·&nbsp; <em>Shared with Jordan for review</em></p>
        `.trim(),
      },
    });

    await prisma.documentShare.create({
      data: {
        documentId: kickoff.id,
        userId: jordan.id,
      },
    });

    await prisma.document.create({
      data: {
        title: "Empty draft — rename me",
        ownerId: maya.id,
        content: "<p></p>",
      },
    });

    await prisma.document.create({
      data: {
        title: "Hiring scorecard draft",
        ownerId: jordan.id,
        content: `
          <h1>Full stack scorecard</h1>
          <p>Working notes for evaluating take-home submissions.</p>
          <ul>
            <li>Product judgment under a timebox</li>
            <li>Editing UX that feels intentional</li>
            <li>Sharing model that is obvious in the UI</li>
          </ul>
        `.trim(),
      },
    });
  }

  console.log("Seeded users:");
  console.log("  maya@folio.dev / folio123  (owner of shared kickoff notes)");
  console.log("  jordan@folio.dev / folio123  (has shared access)");
  console.log("  sam@folio.dev / folio123  (clean account)");
  console.log(`Users: ${maya.name}, ${jordan.name}, ${sam.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
