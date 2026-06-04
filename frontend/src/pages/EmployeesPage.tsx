import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import { type FormEvent, useRef, useState } from "react";
import { ApiValidationError } from "../api/employeeFieldErrors";
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
import {
  ListLoadingCenter,
  ListLoadingIndicator,
} from "../components/CenteredLoadingSpinner";
import { EmployeesTable } from "../components/EmployeesTable";
import { ToastSnackbar } from "../components/ToastSnackbar";
import { dialogContentSx, dialogPaperSlotProps } from "../components/dialogLayout";
import { EmployeeForm } from "../components/EmployeeForm";
import { EMPLOYEE_LIST_PAGE_SIZE, useEmployeeList } from "../hooks/useEmployeeList";
import { useSnackbarToast } from "../hooks/useSnackbarToast";
import { createDialogMutationTracker } from "../utils/dialogMutationTracker";

export function EmployeesPage() {
  const {
    employees,
    error,
    setError,
    loading,
    page,
    totalCount,
    loadEmployees,
    reloadCurrentPage,
  } = useEmployeeList();
  const { toast, showSuccess, showError, closeToast } = useSnackbarToast();
  const addMutation = useRef(createDialogMutationTracker());
  const editMutation = useRef(createDialogMutationTracker());
  const deleteMutation = useRef(createDialogMutationTracker());

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addFieldErrors, setAddFieldErrors] = useState<EmployeeFieldErrors>({});
  const openAddDialog = () => {
    setAddFieldErrors({});
    setAddDialogOpen(true);
  };
  const dismissAddDialog = () => {
    setAddDialogOpen(false);
    setAddFieldErrors({});
  };
  const closeAddDialog = () => {
    addMutation.current.notifyDialogClosed();
    dismissAddDialog();
  };

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editFieldErrors, setEditFieldErrors] = useState<EmployeeFieldErrors>({});
  const openEditDialog = (employee: Employee) => {
    setAddDialogOpen(false);
    setEditFieldErrors({});
    setEditingEmployee(employee);
  };
  const dismissEditDialog = () => {
    setEditingEmployee(null);
    setEditFieldErrors({});
  };
  const closeEditDialog = () => {
    editMutation.current.notifyDialogClosed();
    dismissEditDialog();
  };

  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const closeDeleteDialog = () => {
    deleteMutation.current.notifyDialogClosed();
    setDeletingEmployee(null);
  };

  const openDeleteDialog = (employee: Employee) => {
    setAddDialogOpen(false);
    setEditingEmployee(null);
    setDeletingEmployee(employee);
  };

  const handleMutationError = (
    err: unknown,
    tracker: ReturnType<typeof createDialogMutationTracker>,
    fallbackMessage: string,
    toastMessage: string,
  ) => {
    if (tracker.wasClosedBeforeResult()) {
      showError(toastMessage);
      return;
    }
    setError(err instanceof Error ? err.message : fallbackMessage);
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
    addMutation.current.start();
    void createEmployee(payloadFromForm(form))
      .then(() => {
        dismissAddDialog();
        reloadCurrentPage();
        showSuccess("Employee added");
      })
      .catch((err: unknown) => {
        if (err instanceof ApiValidationError) {
          setAddFieldErrors(err.fieldErrors);
          return;
        }
        handleMutationError(err, addMutation.current, "Failed to add employee", "Could not add employee");
      })
      .finally(() => {
        addMutation.current.finish();
      });
  };

  const handleConfirmDelete = () => {
    if (!deletingEmployee) {
      return;
    }
    const employeeId = deletingEmployee.id;
    deleteMutation.current.start();
    void deleteEmployee(employeeId)
      .then(() => {
        setDeletingEmployee(null);
        reloadCurrentPage();
        showSuccess("Employee deleted");
      })
      .catch((err: unknown) => {
        handleMutationError(
          err,
          deleteMutation.current,
          "Failed to delete employee",
          "Could not delete employee",
        );
      })
      .finally(() => {
        deleteMutation.current.finish();
      });
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
    editMutation.current.start();
    void updateEmployee(employeeId, payloadFromForm(form))
      .then(() => {
        dismissEditDialog();
        reloadCurrentPage();
        showSuccess("Employee updated");
      })
      .catch((err: unknown) => {
        if (err instanceof ApiValidationError) {
          setEditFieldErrors(err.fieldErrors);
          return;
        }
        handleMutationError(
          err,
          editMutation.current,
          "Failed to update employee",
          "Could not update employee",
        );
      })
      .finally(() => {
        editMutation.current.finish();
      });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 96px)" }}>
      <Stack
        direction="row"
        sx={{ mb: 3, alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}
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
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {loading && employees.length === 0 ? (
          <ListLoadingCenter label="Loading employees" />
        ) : (
          <>
            <Box sx={{ position: "relative", flex: 1, minHeight: loading ? "min(60vh, 520px)" : 0 }}>
              <EmployeesTable
                employees={employees}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
              />
              {loading && <ListLoadingIndicator label="Loading employees" />}
            </Box>
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
          </>
        )}
      </Box>
      <DeleteEmployeeDialog
        employee={deletingEmployee}
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
      <ToastSnackbar
        open={toast !== null}
        message={toast?.message ?? ""}
        severity={toast?.severity ?? "success"}
        onClose={closeToast}
      />
    </Box>
  );
}
