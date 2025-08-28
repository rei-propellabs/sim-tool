import { Project } from "./Project";

export interface ClientUpload {
  id: string,
  name: string,
  updatedAt: string,
  createdAt: string,
  projectId: string | null,
  project: Project | null,
  status: string,
}