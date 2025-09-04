export interface SummaryTableType {
  columns: string[];
  sections: {
    title: string;
    rows: {
      label: string;
      values: number[];
      type: "number" | "currency";
    }[];
  }[];
}