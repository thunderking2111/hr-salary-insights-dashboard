import { type FormEvent, useCallback, useEffect, useState } from "react";
import { createEmployee, fetchEmployees } from "../api/client";
import type { CreateEmployeePayload, Employee } from "../api/types";

function payloadFromForm(form: HTMLFormElement): CreateEmployeePayload {
  const data = new FormData(form);
  return {
    first_name: String(data.get("first_name")),
    last_name: String(data.get("last_name")),
    email: String(data.get("email")),
    job_title: String(data.get("job_title")),
    department: String(data.get("department")),
    employment_type: String(data.get("employment_type")),
    country: String(data.get("country")),
    salary: String(data.get("salary")),
    currency: String(data.get("currency")),
    date_of_joining: String(data.get("date_of_joining")),
  };
}

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const loadEmployees = useCallback(() => {
    void fetchEmployees(1)
      .then((data) => setEmployees(data.results))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load employees");
      });
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleAddSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = payloadFromForm(event.currentTarget);
    void createEmployee(payload)
      .then(() => {
        setAddDialogOpen(false);
        loadEmployees();
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to add employee");
      });
  };

  return (
    <div>
      <h1>Employees</h1>
      <button type="button" onClick={() => setAddDialogOpen(true)}>
        Add Employee
      </button>
      {error && <p role="alert">{error}</p>}
      {addDialogOpen && (
        <div role="dialog" aria-labelledby="add-employee-title">
          <h2 id="add-employee-title">Add Employee</h2>
          <form onSubmit={handleAddSubmit}>
            <p>
              <label htmlFor="add-first-name">First name</label>
              <input id="add-first-name" name="first_name" />
            </p>
            <p>
              <label htmlFor="add-last-name">Last name</label>
              <input id="add-last-name" name="last_name" />
            </p>
            <p>
              <label htmlFor="add-email">Email</label>
              <input id="add-email" name="email" type="email" />
            </p>
            <p>
              <label htmlFor="add-job-title">Job title</label>
              <input id="add-job-title" name="job_title" />
            </p>
            <p>
              <label htmlFor="add-department">Department</label>
              <input id="add-department" name="department" />
            </p>
            <p>
              <label htmlFor="add-employment-type">Employment type</label>
              <input id="add-employment-type" name="employment_type" />
            </p>
            <p>
              <label htmlFor="add-country">Country</label>
              <input id="add-country" name="country" />
            </p>
            <p>
              <label htmlFor="add-salary">Salary</label>
              <input id="add-salary" name="salary" />
            </p>
            <p>
              <label htmlFor="add-currency">Currency</label>
              <input id="add-currency" name="currency" />
            </p>
            <p>
              <label htmlFor="add-date-of-joining">Date of joining</label>
              <input id="add-date-of-joining" name="date_of_joining" type="date" />
            </p>
            <button type="submit">Save</button>
          </form>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Job Title</th>
            <th scope="col">Country</th>
            <th scope="col">Department</th>
            <th scope="col">Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.full_name}</td>
              <td>{employee.job_title}</td>
              <td>{employee.country}</td>
              <td>{employee.department}</td>
              <td>{employee.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
