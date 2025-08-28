import { ClientUpload } from "./ClientUpload";

export interface ListClientProjectResponse {
  rows: ClientUpload[];
  total: number;
}