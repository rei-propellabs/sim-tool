import { User } from "./User";

export interface ListUserAccessResponse {
  rows: User[];
  total: number;
}