export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

export type DocUser = {
  id: string;
  name: string;
  email: string;
};

export type DocumentSummary = {
  id: string;
  title: string;
  ownerId: string;
  relation: "owned" | "shared";
  owner: DocUser;
  sharedWith: DocUser[];
  createdAt: string;
  updatedAt: string;
};

export type DocumentDetail = DocumentSummary & {
  content: string;
  canEdit: boolean;
  canShare: boolean;
};
