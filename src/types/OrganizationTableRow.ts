export type ProjectStatus = "Created" | "NoActionRequired" | "ReadyForCalculation" | "ScenariosUploaded" | "PresentationAvailable";

export interface OrganizationTableRow {
  name: string,
  id: string;
  siteCount: number;
  createdAt: string;
  updatedAt: string;
  projectStatus: {title: string, status: ProjectStatus};
  dueDate?: string | null;
}