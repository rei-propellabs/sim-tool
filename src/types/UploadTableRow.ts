export interface UploadTableRow {
  name: string,
  id: string;
  createdAt: string;
  updatedAt: string;
  uploadedTo: string;
  dataStatus?: string;
  projectStatus: string;
  projectStatusColor: string;
  lastUploadAt?: string | null;
}