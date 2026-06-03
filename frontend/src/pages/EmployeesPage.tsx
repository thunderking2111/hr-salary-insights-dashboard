import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import { type FormEvent, useState } from "react";
import type { EmployeeFieldErrors } from "../api/employeeFieldErrors";
import { employeeToFormValues } from "../api/employeeFormValues";
import { payloadFromForm } from "../api/employeePayload";
import { createEmployee, deleteEmployee, updateEmployee } from "../api/client";
import type { Employee } from "../api/types";
import {
  hasEmployeeFieldErrors,
  validateEmployeeForm,
} from "../api/validateEmployeePayload";
import { DeleteEmployeeDialog } from "../components/DeleteEmployeeDialog";
import { DialogTitleBar } from "../components/DialogTitleBar";
import { EmployeesTable } from "../components/EmployeesTable";
import { dialogContentSx, dialogPaperSlotProps } from "../components/dialogLayout";
import { EmployeeForm } from "../components/EmployeeForm";
import { EMPLOYEE_LIST_PAGE_SIZE, useEmployeeList } from "../hooks/useEmployeeList";
import { runMutation } from "../utils/runMutation";

export function EmployeesPage() {
  const {
    employees,
    error,
    setError,
    page,
    totalCount,
    loadEmployees,
    reloadCurrentPage,
  } = useEmployeeList();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addFieldErrors, setAddFieldErrors] = useState<EmployeeFieldErrors>({});
  const openAddDialog = () => {
    setAddFieldErrors({});
    setAddDialogOpen(true);
  };
  const closeAddDialog = () => {
    setAddDialogOpen(false);
    setAddFieldErrors({});
  };
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editFieldErrors, setEditFieldErrors] = useState<EmployeeFieldErrors>({});
  const openEditDialog = (employee: Employee) => {
    setAddDialogOpen(false);
    setEditFieldErrors({});
    setEditingEmployee(employee);
  };
  const closeEditDialog = () => {
    setEditingEmployee(null);
    setEditFieldErrors({});
  };
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const closeDeleteDialog = () => setDeletingEmployee(null);

  const openDeleteDialog = (employee: Employee) => {
    setAddDialogOpen(false);
    setEditingEmployee(null);
    setDeletingEmployee(employee);
  };

  const handleAddSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const clientErrors = validateEmployeeForm(form);
    if (hasEmployeeFieldErrors(clientErrors)) {
      setAddFieldErrors(clientErrors);
      return;
    }

    setAddFieldErrors({});
    runMutation(
      createEmployee(payloadFromForm(form)),
      () => {
        closeAddDialog();
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
    const form = event.currentTarget;
    const clientErrors = validateEmployeeForm(form);
    if (hasEmployeeFieldErrors(clientErrors)) {
      setEditFieldErrors(clientErrors);
      return;
    }

    const employeeId = editingEmployee.id;
    setEditFieldErrors({});
    runMutation(
      updateEmployee(employeeId, payloadFromForm(form)),
      () => {
        closeEditDialog();
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
        <Button variant="contained" color="primary" onClick={openAddDialog}>
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
        slotProps={dialogPaperSlotProps}
      >
        <DialogTitleBar id="add-employee-title" title="Add Employee" onClose={closeAddDialog} />
        <DialogContent sx={dialogContentSx}>
          <EmployeeForm
            idPrefix="add"
            formId="add-employee-form"
            hideSubmit
            fieldErrors={addFieldErrors}
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
      <Dialog
        open={editingEmployee !== null}
        onClose={closeEditDialog}
        maxWidth="sm"
        fullWidth
        aria-labelledby="edit-employee-title"
        slotProps={dialogPaperSlotProps}
      >
        <DialogTitleBar id="edit-employee-title" title="Edit Employee" onClose={closeEditDialog} />
        <DialogContent sx={dialogContentSx}>
          {editingEmployee && (
            <EmployeeForm
              idPrefix="edit"
              formId="edit-employee-form"
              hideSubmit
              defaultValues={employeeToFormValues(editingEmployee)}
              fieldErrors={editFieldErrors}
              onSubmit={handleEditSubmit}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button type="submit" form="edit-employee-form" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <EmployeesTable
        employees={employees}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />
      <TablePagination
        component="div"
        role="navigation"
        aria-label="Employees pagination"
        count={totalCount}
        page={Math.max(0, page - 1)}
        onPageChange={(_event, newPage) => loadEmployees(newPage + 1)}
        rowsPerPage={EMPLOYEE_LIST_PAGE_SIZE}
        rowsPerPageOptions={[]}
      />
      <DeleteEmployeeDialog
        employee={deletingEmployee}
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
