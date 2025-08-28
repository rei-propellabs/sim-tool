export interface Project {
  id: string;
  name: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  lastUploadAt?: string | null;
  status: string;
  siteId?: string;
}