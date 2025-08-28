import { Organization } from "./Organization";

export interface AuthCheckData {
  id: string;
  userId: string;
  organizationId: string;
  name: string;
  email: string;
  organization: Organization
}