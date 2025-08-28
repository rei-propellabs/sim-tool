import { FileStatus } from "components/types/FileStatus";

export interface FileInfo {
  name?: string; 
  size?: number;
  status: FileStatus;
  uploader?: string;
  uploadDate?: Date;
  type: string;
  id?: string;
}
