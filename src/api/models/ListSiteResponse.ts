import { Site } from "./Site";

export interface ListSiteResponse {
  rows: Site[];
  total: number;
  offset: number;
}