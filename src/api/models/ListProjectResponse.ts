import { Project } from "./Project";

export interface ListProjectResponse {
  rows: Project[];
  total: number;
  offset: number;
}