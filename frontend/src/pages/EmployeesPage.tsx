import { type FormEvent, useCallback, useEffect, useState } from "react";
import { createEmployee, deleteEmployee, fetchEmployees, updateEmployee } from "../api/client";
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
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const loadEmployees = useCallback((pageToLoad: number) => {
    void fetchEmployees(pageToLoad)
      .then((data) => {
        setEmployees(data.results);
        setPage(pageToLoad);
        setHasNextPage(data.next !== null);
        setHasPreviousPage(data.previous !== null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load employees");
      });
  }, []);

  useEffect(() => {
    loadEmployees(1);
  }, [loadEmployees]);

  const handleAddSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = payloadFromForm(event.currentTarget);
    void createEmployee(payload)
      .then(() => {
        setAddDialogOpen(false);
        loadEmployees(page);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to add employee");
      });
  };

  const handleConfirmDelete = () => {
    if (!deletingEmployee) {
      return;
    }
    const employeeId = deletingEmployee.id;
    void deleteEmployee(employeeId)
      .then(() => {
        setDeletingEmployee(null);
        loadEmployees(page);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to delete employee");
      });
  };

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingEmployee) {
      return;
    }
    const employeeId = editingEmployee.id;
    const payload = payloadFromForm(event.currentTarget);
    void updateEmployee(employeeId, payload)
      .then(() => {
        setEditingEmployee(null);
        loadEmployees(page);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to update employee");
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
      {editingEmployee && (
        <div role="dialog" aria-labelledby="edit-employee-title">
          <h2 id="edit-employee-title">Edit Employee</h2>
          <form onSubmit={handleEditSubmit}>
            <p>
              <label htmlFor="edit-first-name">First name</label>
              <input
                id="edit-first-name"
                name="first_name"
                defaultValue={editingEmployee.first_name}
              />
            </p>
            <p>
              <label htmlFor="edit-last-name">Last name</label>
              <input
                id="edit-last-name"
                name="last_name"
                defaultValue={editingEmployee.last_name}
              />
            </p>
            <p>
              <label htmlFor="edit-email">Email</label>
              <input
                id="edit-email"
                name="email"
                type="email"
                defaultValue={editingEmployee.email}
              />
            </p>
            <p>
              <label htmlFor="edit-job-title">Job title</label>
              <input
                id="edit-job-title"
                name="job_title"
                defaultValue={editingEmployee.job_title}
              />
            </p>
            <p>
              <label htmlFor="edit-department">Department</label>
              <input
                id="edit-department"
                name="department"
                defaultValue={editingEmployee.department}
              />
            </p>
            <p>
              <label htmlFor="edit-employment-type">Employment type</label>
              <input
                id="edit-employment-type"
                name="employment_type"
                defaultValue={editingEmployee.employment_type}
              />
            </p>
            <p>
              <label htmlFor="edit-country">Country</label>
              <input id="edit-country" name="country" defaultValue={editingEmployee.country} />
            </p>
            <p>
              <label htmlFor="edit-salary">Salary</label>
              <input id="edit-salary" name="salary" defaultValue={editingEmployee.salary} />
            </p>
            <p>
              <label htmlFor="edit-currency">Currency</label>
              <input
                id="edit-currency"
                name="currency"
                defaultValue={editingEmployee.currency}
              />
            </p>
            <p>
              <label htmlFor="edit-date-of-joining">Date of joining</label>
              <input
                id="edit-date-of-joining"
                name="date_of_joining"
                type="date"
                defaultValue={editingEmployee.date_of_joining}
              />
            </p>
            <button type="submit">Save</button>
          </form>
        </div>
      )}
      {deletingEmployee && (
        <div role="dialog" aria-labelledby="delete-employee-title">
          <h2 id="delete-employee-title">Delete Employee</h2>
          <p>
            Delete {deletingEmployee.full_name}? This cannot be undone.
          </p>
          <button type="button" onClick={() => setDeletingEmployee(null)}>
            Cancel
          </button>
          <button type="button" onClick={handleConfirmDelete}>
            Confirm delete
          </button>
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
            <th scope="col">Actions</th>
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
              <td>
                <button type="button" onClick={() => setEditingEmployee(employee)}>
                  Edit {employee.full_name}
                </button>{" "}
                <button type="button" onClick={() => setDeletingEmployee(employee)}>
                  Delete {employee.full_name}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hasPreviousPage && (
        <button type="button" onClick={() => loadEmployees(page - 1)}>
          Previous page
        </button>
      )}
      {hasNextPage && (
        <button type="button" onClick={() => loadEmployees(page + 1)}>
          Next page
        </button>
      )}
    </div>
  );
}
