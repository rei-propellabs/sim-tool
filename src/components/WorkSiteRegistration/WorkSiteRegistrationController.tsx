import React, { useState } from 'react';
import { ReusableFormView } from '../../components/Form/FormView';
import type { FormData } from '../../components/Form/FormModel';
import { workSiteFields } from './WorkSiteRegistrationModel';

export const WorkSiteRegistrationController: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [enableSubmit, setEnableSubmit] = useState(false);

  const handleFieldChange = (name: string, value: string | File | null) => {
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    console.log(formData)

    let valid = true;
    workSiteFields.forEach((field) => {
      if (field.required && !newFormData[field.name]) {
        valid = false;
        console.log('Missing required field:', field.name);
        
      }
    });
    setEnableSubmit(valid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log(JSON.stringify(formData, null, 2));
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        submissionData.append(key, value);
      } else if (value) {
        submissionData.append(key, value);
      }
    });

    console.log('Work Site Registration Data:', formData);
  };

  return (
    <ReusableFormView
      fields={workSiteFields}
      formData={formData}
      enableSubmit={enableSubmit}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
      title="Add site"
    />
  );
};