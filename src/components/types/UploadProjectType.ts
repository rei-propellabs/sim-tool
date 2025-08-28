import { ProjectStatusType } from "./ProjectStatus";

export interface UploadProjectType {
  project: string,
  boreholes?: number,
  lastUpdate?: string,
  due?: string,
  dataStatus: string,
  projectStatus: ProjectStatusType,
}