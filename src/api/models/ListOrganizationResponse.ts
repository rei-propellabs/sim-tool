import { Organization } from "./Organization";

export interface ListOrganizationResponse {
  rows: Organization[];
  total: number;
  offset: number;
  uploadCount: number;
}