import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getAccessibleDocument } from "@/lib/documents";
import { DocumentEditor } from "@/components/editor/document-editor";

type Props = { params: Promise<{ id: string }> };

export default async function DocumentPage({ params }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const document = await getAccessibleDocument(id, user.id);
  if (!document) notFound();

  return <DocumentEditor document={document} />;
}
