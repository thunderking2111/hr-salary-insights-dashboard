import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import type { Employee } from "../api/types";

interface EmployeesTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeesTable({ employees, onEdit, onDelete }: EmployeesTableProps) {
  return (
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
                    onClick={() => onEdit(employee)}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={`Delete ${employee.full_name}`}>
                  <IconButton
                    aria-label={`Delete ${employee.full_name}`}
                    onClick={() => onDelete(employee)}
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
  );
}
