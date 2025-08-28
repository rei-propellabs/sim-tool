export interface Company {
  id: string;
  name: string;
  hash: string;
  settings: Record<string, any>;
  isActive: boolean;
  isAdmin: boolean;
  schema: string;
  deleteAfter: Date | null;
  dueDate: Date;
  engagementStartDate: Date;
  region: string;
  dataStatus: string;
  createdAt: Date;
  updatedAt: Date;
}