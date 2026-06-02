import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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
  const closeAddDialog = () => setAddDialogOpen(false);
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
      <Dialog
        open={addDialogOpen}
        onClose={closeAddDialog}
        maxWidth="sm"
        fullWidth
        aria-labelledby="add-employee-title"
      >
        <DialogTitle
          id="add-employee-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            pr: 2,
          }}
        >
          Add Employee
          <IconButton
            aria-label="Close"
            onClick={closeAddDialog}
            sx={{
              flexShrink: 0,
              color: "text.secondary",
              "&:hover": { color: "text.primary", bgcolor: "action.hover" },
            }}
          >
            <CloseIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <EmployeeForm
            idPrefix="add"
            formId="add-employee-form"
            hideSubmit
            onSubmit={handleAddSubmit}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddDialog}>Cancel</Button>
          <Button type="submit" form="add-employee-form" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
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
      <TableContainer>
        <Table aria-label="Employees">
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="col">
                Name
              </TableCell>
              <TableCell component="th" scope="col">
                Job Title
              </TableCell>
              <TableCell component="th" scope="col">
                Country
              </TableCell>
              <TableCell component="th" scope="col">
                Department
              </TableCell>
              <TableCell component="th" scope="col">
                Salary
              </TableCell>
              <TableCell component="th" scope="col">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.full_name}</TableCell>
                <TableCell>{employee.job_title}</TableCell>
                <TableCell>{employee.country}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.salary}</TableCell>
                <TableCell>
                  <button type="button" onClick={() => setEditingEmployee(employee)}>
                    Edit {employee.full_name}
                  </button>{" "}
                  <button type="button" onClick={() => setDeletingEmployee(employee)}>
                    Delete {employee.full_name}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
