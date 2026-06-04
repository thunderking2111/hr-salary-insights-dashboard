import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { CountrySalaryInsight } from "../api/types";
import { formatSalaryValue } from "../utils/formatSalary";

interface CountrySalaryTableProps {
  countries: CountrySalaryInsight[];
  onCountrySelect?: (country: string) => void;
}

export function CountrySalaryTable({ countries, onCountrySelect }: CountrySalaryTableProps) {
  if (countries.length === 0) {
    return null;
  }

  return (
    <TableContainer>
      <Table aria-label="Salary by country" size="small">
        <TableHead>
          <TableRow>
            <TableCell component="th" scope="col">
              Country
            </TableCell>
            <TableCell component="th" scope="col" align="right">
              Employees
            </TableCell>
            <TableCell component="th" scope="col" align="right">
              Min salary
            </TableCell>
            <TableCell component="th" scope="col" align="right">
              Max salary
            </TableCell>
            <TableCell component="th" scope="col" align="right">
              Avg salary
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countries.map((row) => (
            <TableRow
              key={row.country}
              hover
              onClick={onCountrySelect ? () => onCountrySelect(row.country) : undefined}
              sx={onCountrySelect ? { cursor: "pointer" } : undefined}
            >
              <TableCell>{row.country}</TableCell>
              <TableCell align="right">{row.employee_count}</TableCell>
              <TableCell align="right">{formatSalaryValue(Number(row.min_salary))}</TableCell>
              <TableCell align="right">{formatSalaryValue(Number(row.max_salary))}</TableCell>
              <TableCell align="right">{formatSalaryValue(Number(row.avg_salary))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
