import { Project } from "./Project";

export interface Organization {
  id: string;
  name: string;
  hash: string;
  settings: Record<string, any>;
  isActive: boolean;
  isAdmin: boolean;
  schema: string;
  deleteAfter: string | null;
  dueDate: string; // ISO date string
  engagementStartDate: string; // ISO date string
  region: string;
  dataStatus: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  siteCount: number;
  uploadCount: number;
  lastUpload: Project;
  statuses: Record<string, number>;
}
