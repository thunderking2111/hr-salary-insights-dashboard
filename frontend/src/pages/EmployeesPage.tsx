import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type FormEvent, useState } from "react";
import { payloadFromForm } from "../api/employeePayload";
import { createEmployee, deleteEmployee, updateEmployee } from "../api/client";
import type { Employee } from "../api/types";
import { EmployeeForm } from "../components/EmployeeForm";
import { useEmployeeList } from "../hooks/useEmployeeList";

function toFormValues(employee: Employee) {
  return {
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    job_title: employee.job_title,
    department: employee.department,
    employment_type: employee.employment_type,
    country: employee.country,
    salary: employee.salary,
    currency: employee.currency,
    date_of_joining: employee.date_of_joining,
  };
}

function runMutation(
  mutation: Promise<unknown>,
  onSuccess: () => void,
  setError: (message: string) => void,
  errorMessage: string,
): void {
  void mutation
    .then(onSuccess)
    .catch((err: unknown) => {
      setError(err instanceof Error ? err.message : errorMessage);
    });
}

export function EmployeesPage() {
  const {
    employees,
    error,
    setError,
    page,
    hasNextPage,
    hasPreviousPage,
    loadEmployees,
    reloadCurrentPage,
  } = useEmployeeList();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const handleAddSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runMutation(
      createEmployee(payloadFromForm(event.currentTarget)),
      () => {
        setAddDialogOpen(false);
        reloadCurrentPage();
      },
      setError,
      "Failed to add employee",
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingEmployee) {
      return;
    }
    const employeeId = deletingEmployee.id;
    runMutation(
      deleteEmployee(employeeId),
      () => {
        setDeletingEmployee(null);
        reloadCurrentPage();
      },
      setError,
      "Failed to delete employee",
    );
  };

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingEmployee) {
      return;
    }
    const employeeId = editingEmployee.id;
    runMutation(
      updateEmployee(employeeId, payloadFromForm(event.currentTarget)),
      () => {
        setEditingEmployee(null);
        reloadCurrentPage();
      },
      setError,
      "Failed to update employee",
    );
  };

  return (
    <div>
      <Stack
        direction="row"
        sx={{ mb: 3, alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography component="h1" variant="h4">
          Employees
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setAddDialogOpen(true)}>
          Add Employee
        </Button>
      </Stack>
      {error && <p role="alert">{error}</p>}
      {addDialogOpen && (
        <div role="dialog" aria-labelledby="add-employee-title">
          <h2 id="add-employee-title">Add Employee</h2>
          <EmployeeForm idPrefix="add" onSubmit={handleAddSubmit} />
        </div>
      )}
      {editingEmployee && (
        <div role="dialog" aria-labelledby="edit-employee-title">
          <h2 id="edit-employee-title">Edit Employee</h2>
          <EmployeeForm
            idPrefix="edit"
            defaultValues={toFormValues(editingEmployee)}
            onSubmit={handleEditSubmit}
          />
        </div>
      )}
      {deletingEmployee && (
        <div role="dialog" aria-labelledby="delete-employee-title">
          <h2 id="delete-employee-title">Delete Employee</h2>
          <p>Delete {deletingEmployee.full_name}? This cannot be undone.</p>
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
