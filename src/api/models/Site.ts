import { Project } from "./Project";

export interface Site {
  id: string;
  name: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  projectCount: number;
  uploadCount: number;
  uploadedAt: string;
  lastUpload: Project;
  statuses: Record<string, number>;
}