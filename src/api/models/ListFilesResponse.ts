import { ClientUpload } from "./ClientUpload";
import { FileUpload } from "./FileUpload";
import { Project } from "./Project";

export interface ListFilesResponse {
    id: string,
    name: string,
    status: string,
    supplementaryInfo: string,
    completedAt: string | null,
    updatedAt: string,
    createdAt: string,
    projectId: string | null,
    project: Project | null,
    files: FileUpload[],
}