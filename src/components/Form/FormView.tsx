import React from 'react';
import { FormField, FormData } from './FormModel';
import { Lock } from 'images/Dynamic//Lock';
import styles from './Form.module.css';
import UploadFile from "./UploadFile/UploadFile";

interface ReusableFormViewProps {
  fields: FormField[];
  formData: FormData;
  enableSubmit: boolean;
  onFieldChange: (name: string, value: string | File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  editable?: boolean;
}

export const ReusableFormView: React.FC<ReusableFormViewProps> = ({
  fields,
  formData,
  enableSubmit,
  onFieldChange,
  onSubmit,
  title,
}) => {
  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <div className={styles.input_outer}>
            <input type="text"
              disabled={field.editable === false}
              readOnly={field.editable === false}
              className={styles.input_inner}
              id={field.name}
              name={field.name}
              value={(formData[field.name] as string) || ''}
              onChange={(e) => onFieldChange(field.name, e.target.value)}
              required={field.required} />
            {
              field.editable === false &&
              <span className={styles.lock}><Lock color="#E6F9F8" size={16} /></span>
            }
          </div>

        );
      case 'select':
        return (
          <div className={styles.input_outer}>
            <select
              id={field.name}
              name={field.name}
              value={(formData[field.name] as string) || ''}
              onChange={(e) => onFieldChange(field.name, e.target.value)}
              className={styles.select}
              required={field.required}
              disabled={field.editable === false}
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {
              field.editable === false &&
              <span className={styles.lock}><Lock color="#E6F9F8" size={16} /></span>
            }
          </div>

        );
      case 'image':
        return (
          <div>
            <UploadFile
              onUploadComplete={(file) => onFieldChange(field.name, file)}
            />
            {formData[field.name] && (
              <img
                src={
                  formData[field.name] instanceof File
                    ? URL.createObjectURL(formData[field.name] as File)
                    : (formData[field.name] as string)
                }
                alt="Preview"
                className={styles.imagePreview}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>{title}</h2>
      <form onSubmit={onSubmit} className={styles.form}>
        {fields.map((field) => (
          <div key={field.name} className={styles.formGroup}>
            <label htmlFor={field.name} className={styles.label}>
              {field.label}
            </label>
            {renderField(field)}
          </div>
        ))}
        <button 
          type="submit"
          className={`${styles.submitButton} ${!enableSubmit ? styles.disable : ''}`}
          disabled={enableSubmit === false}>
          Upload
        </button>
      </form>
    </div>
  );
};