export interface SelectOption {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'image';
  value?: string; // Optional for initial value
  options?: SelectOption[]; // For dropdown
  required?: boolean;
  editable?: boolean;

}

export interface FormData {
  [key: string]: string | File | null;
}