export interface OrganizationTableRow {
  name: string,
  id: string;
  siteCount: number;
  createdAt: string;
  updatedAt: string;
  uploadCount: number;
  dueDate?: string | null;
  numActionRequired: number;
}