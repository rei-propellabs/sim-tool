import { FormField } from '../../components/Form/FormModel';

export const workSiteFields: FormField[] = [
  { name: 'siteName', label: 'Site Name', type: 'text', required: true },
  { name: 'siteSize', label: 'Site Size', type: 'text', required: true },
  { name: 'siteLocation', label: 'Site Location', type: 'text', required: true },
  { 
    name: 'numProjects', 
    label: 'Number of projects', 
    type: 'select',
    options: Array.from({ length: 5 }, (_, i) => ({ value: `${i + 1}`, label: (i + 1).toString() })),
    required: true 
  },
  { name: 'siteImage', label: 'Site Image', type: 'image' },
];