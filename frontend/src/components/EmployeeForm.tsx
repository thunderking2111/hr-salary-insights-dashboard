import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { FormEvent } from "react";
import type { EmployeeFieldErrors } from "../api/employeeFieldErrors";
import type { CreateEmployeePayload } from "../api/types";

interface EmployeeFormProps {
  idPrefix: string;
  formId?: string;
  defaultValues?: CreateEmployeePayload;
  hideSubmit?: boolean;
  fieldErrors?: EmployeeFieldErrors;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

interface FieldConfig {
  name: keyof CreateEmployeePayload;
  label: string;
  type?: string;
}

const EMPLOYEE_FIELDS: FieldConfig[] = [
  { name: "first_name", label: "First name" },
  { name: "last_name", label: "Last name" },
  { name: "email", label: "Email", type: "email" },
  { name: "job_title", label: "Job title" },
  { name: "department", label: "Department" },
  { name: "employment_type", label: "Employment type" },
  { name: "salary", label: "Salary" },
  { name: "country", label: "Country" },
  { name: "currency", label: "Currency" },
  { name: "date_of_joining", label: "Date of joining", type: "date" },
];

export function EmployeeForm({
  idPrefix,
  formId,
  defaultValues,
  hideSubmit = false,
  fieldErrors = {},
  onSubmit,
}: EmployeeFormProps) {
  return (
    <Stack
      component="form"
      id={formId}
      onSubmit={onSubmit}
      spacing={2}
      sx={{ width: "100%", pt: 0.5 }}
      noValidate
    >
      {EMPLOYEE_FIELDS.map(({ name, label, type }) => {
        const fieldId = `${idPrefix}-${name.replace(/_/g, "-")}`;
        const errorMessage = fieldErrors[name];

        return (
          <TextField
            key={name}
            id={fieldId}
            name={name}
            label={label}
            type={type ?? "text"}
            defaultValue={defaultValues?.[name]}
            error={Boolean(errorMessage)}
            helperText={errorMessage}
            required
            fullWidth
            size="small"
            slotProps={{
              inputLabel: { shrink: type === "date" ? true : undefined },
            }}
          />
        );
      })}
      {!hideSubmit && <button type="submit">Save</button>}
    </Stack>
  );
}
