import { requireUser } from "@/lib/auth";
import { listDocumentsForUser } from "@/lib/documents";
import { DocumentList } from "@/components/document-list";

export default async function DocumentsPage() {
  const user = await requireUser();
  const lists = await listDocumentsForUser(user.id);

  return <DocumentList owned={lists.owned} shared={lists.shared} />;
}
