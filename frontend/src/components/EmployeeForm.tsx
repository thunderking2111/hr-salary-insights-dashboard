import type { FormEvent } from "react";
import type { CreateEmployeePayload } from "../api/types";

interface EmployeeFormProps {
  idPrefix: string;
  formId?: string;
  defaultValues?: CreateEmployeePayload;
  hideSubmit?: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function EmployeeForm({
  idPrefix,
  formId,
  defaultValues,
  hideSubmit = false,
  onSubmit,
}: EmployeeFormProps) {
  return (
    <form id={formId} onSubmit={onSubmit}>
      <p>
        <label htmlFor={`${idPrefix}-first-name`}>First name</label>
        <input
          id={`${idPrefix}-first-name`}
          name="first_name"
          defaultValue={defaultValues?.first_name}
        />
      </p>
      <p>
        <label htmlFor={`${idPrefix}-last-name`}>Last name</label>
        <input
          id={`${idPrefix}-last-name`}
          name="last_name"
          defaultValue={defaultValues?.last_name}
        />
      </p>
      <p>
        <label htmlFor={`${idPrefix}-email`}>Email</label>
        <input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          defaultValue={defaultValues?.email}
        />
      </p>
      <p>
        <label htmlFor={`${idPrefix}-job-title`}>Job title</label>
        <input
          id={`${idPrefix}-job-title`}
          name="job_title"
          defaultValue={defaultValues?.job_title}
        />
      </p>
      <p>
        <label htmlFor={`${idPrefix}-department`}>Department</label>
        <input
          id={`${idPrefix}-department`}
          name="department"
          defaultValue={defaultValues?.department}
        />
      </p>
      <p>
        <label htmlFor={`${idPrefix}-employment-type`}>Employment type</label>
        <input
          id={`${idPrefix}-employment-type`}
          name="employment_type"
          defaultValue={defaultValues?.employment_type}
        />
      </p>
      <p>
        <label htmlFor={`${idPrefix}-country`}>Country</label>
        <input
          id={`${idPrefix}-country`}
          name="country"
          defaultValue={defaultValues?.country}
        />
      </p>
      <p>
        <label htmlFor={`${idPrefix}-salary`}>Salary</label>
        <input id={`${idPrefix}-salary`} name="salary" defaultValue={defaultValues?.salary} />
      </p>
      <p>
        <label htmlFor={`${idPrefix}-currency`}>Currency</label>
        <input
          id={`${idPrefix}-currency`}
          name="currency"
          defaultValue={defaultValues?.currency}
        />
      </p>
      <p>
        <label htmlFor={`${idPrefix}-date-of-joining`}>Date of joining</label>
        <input
          id={`${idPrefix}-date-of-joining`}
          name="date_of_joining"
          type="date"
          defaultValue={defaultValues?.date_of_joining}
        />
      </p>
      {!hideSubmit && <button type="submit">Save</button>}
    </form>
  );
}
