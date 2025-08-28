export interface ProjectTableRow {
  name: string,
  id: string;
  updatedAt: string;
  dataStatus: string;
  projectStatus: string;
  projectStatusColor: string;
  lastUploadAt: string | null;
}