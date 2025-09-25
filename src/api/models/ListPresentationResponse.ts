import { Presentation } from "./Presentation";

export interface ListPresentationResponse {
  rows: Presentation[];
  total: number;
  offset: number;
}