import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { type FormEvent, useState } from "react";
import { employeeToFormValues } from "../api/employeeFormValues";
import { payloadFromForm } from "../api/employeePayload";
import { createEmployee, deleteEmployee, updateEmployee } from "../api/client";
import type { Employee } from "../api/types";
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
  const closeAddDialog = () => setAddDialogOpen(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const closeEditDialog = () => setEditingEmployee(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const closeDeleteDialog = () => setDeletingEmployee(null);

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
        slotProps={{
          paper: {
            sx: { overflowX: "hidden" },
          },
        }}
      >
        <DialogTitle
          id="add-employee-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            boxSizing: "border-box",
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
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
        <DialogContent sx={{ overflowX: "hidden", boxSizing: "border-box" }}>
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
      <Dialog
        open={editingEmployee !== null}
        onClose={closeEditDialog}
        maxWidth="sm"
        fullWidth
        aria-labelledby="edit-employee-title"
        slotProps={{
          paper: {
            sx: { overflowX: "hidden" },
          },
        }}
      >
        <DialogTitle
          id="edit-employee-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            boxSizing: "border-box",
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            pr: 2,
          }}
        >
          Edit Employee
          <IconButton
            aria-label="Close"
            onClick={closeEditDialog}
            sx={{
              flexShrink: 0,
              color: "text.secondary",
              "&:hover": { color: "text.primary", bgcolor: "action.hover" },
            }}
          >
            <CloseIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ overflowX: "hidden", boxSizing: "border-box" }}>
          {editingEmployee && (
            <EmployeeForm
              idPrefix="edit"
              formId="edit-employee-form"
              hideSubmit
              defaultValues={employeeToFormValues(editingEmployee)}
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
                  <Tooltip title={`Edit ${employee.full_name}`}>
                    <IconButton
                      aria-label={`Edit ${employee.full_name}`}
                      onClick={() => setEditingEmployee(employee)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`Delete ${employee.full_name}`}>
                    <IconButton
                      aria-label={`Delete ${employee.full_name}`}
                      onClick={() => {
                        setAddDialogOpen(false);
                        setEditingEmployee(null);
                        setDeletingEmployee(employee);
                      }}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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

      <Dialog
        open={deletingEmployee !== null}
        onClose={closeDeleteDialog}
        maxWidth="sm"
        fullWidth
        scroll="paper"
        aria-labelledby="delete-employee-title"
        aria-describedby="delete-employee-description"
        slotProps={{
          paper: {
            sx: { overflowX: "hidden" },
          },
        }}
      >
        <DialogTitle
          id="delete-employee-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            boxSizing: "border-box",
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            pr: 2,
          }}
        >
          Delete employee?
          <IconButton
            aria-label="Close"
            onClick={closeDeleteDialog}
            sx={{
              flexShrink: 0,
              color: "text.secondary",
              "&:hover": { color: "text.primary", bgcolor: "action.hover" },
            }}
          >
            <CloseIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ overflowX: "hidden", boxSizing: "border-box" }}>
          {deletingEmployee && (
            <DialogContentText id="delete-employee-description">
              Remove {deletingEmployee.full_name} from the directory? This cannot be undone.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
