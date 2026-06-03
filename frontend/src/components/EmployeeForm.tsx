import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { FormEvent } from "react";
import { ADD_EMPLOYEE_FORM_DEFAULTS } from "../api/employeeDefaults";
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
  required?: boolean;
}

const EMPLOYEE_FIELDS: FieldConfig[] = [
  { name: "first_name", label: "First name", required: true },
  { name: "last_name", label: "Last name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "job_title", label: "Job title", required: true },
  { name: "department", label: "Department", required: true },
  { name: "employment_type", label: "Employment type", required: true },
  { name: "salary", label: "Salary", required: true },
  { name: "date_of_joining", label: "Date of joining", type: "date", required: true },
  { name: "country", label: "Country" },
  { name: "currency", label: "Currency" },
];

export function EmployeeForm({
  idPrefix,
  formId,
  defaultValues,
  hideSubmit = false,
  fieldErrors = {},
  onSubmit,
}: EmployeeFormProps) {
  const resolvedDefaults = { ...ADD_EMPLOYEE_FORM_DEFAULTS, ...defaultValues };

  return (
    <Stack
      component="form"
      id={formId}
      onSubmit={onSubmit}
      spacing={2}
      sx={{ width: "100%", pt: 0.5 }}
      noValidate
    >
      {EMPLOYEE_FIELDS.map(({ name, label, type, required: fieldRequired }) => {
        const fieldId = `${idPrefix}-${name.replace(/_/g, "-")}`;
        const helperId = `${fieldId}-helper`;
        const errorMessage = fieldErrors[name];

        return (
          <TextField
            key={name}
            id={fieldId}
            name={name}
            label={label}
            type={type ?? "text"}
            defaultValue={resolvedDefaults[name]}
            error={Boolean(errorMessage)}
            helperText={errorMessage}
            required={fieldRequired}
            fullWidth
            size="small"
            slotProps={{
              formHelperText: {
                id: helperId,
                role: errorMessage ? "alert" : undefined,
              },
              htmlInput: {
                "aria-errormessage": errorMessage ? helperId : undefined,
                "aria-invalid": errorMessage ? true : undefined,
              },
              inputLabel: { shrink: type === "date" ? true : undefined },
            }}
          />
        );
      })}
      {!hideSubmit && <button type="submit">Save</button>}
    </Stack>
  );
}
