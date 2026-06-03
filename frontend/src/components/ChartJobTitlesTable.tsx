import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { JobTitleSalaryInsight } from "../api/types";
import { formatSalaryValue } from "../utils/formatSalary";
import { topJobTitlesByAverageSalary } from "../utils/jobTitleInsights";

const TABLE_MAX_WIDTH = 560;

interface ChartJobTitlesTableProps {
  country: string;
  jobTitles: JobTitleSalaryInsight[];
}

export function ChartJobTitlesTable({ country, jobTitles }: ChartJobTitlesTableProps) {
  const topJobTitles = topJobTitlesByAverageSalary(jobTitles);

  if (topJobTitles.length === 0) {
    return null;
  }

  const tableLabel = `Salary by job in ${country}`;

  return (
    <Box
      component="section"
      sx={{
        mt: 3,
        mx: "auto",
        width: "100%",
        maxWidth: TABLE_MAX_WIDTH,
      }}
    >
      <Typography component="h2" variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Salary by job — {country}
      </Typography>
      <TableContainer>
        <Table
          aria-label={tableLabel}
          size="small"
          sx={{
            "& .MuiTableCell-root": {
              borderBottom: "1px solid",
              borderColor: "divider",
              py: 1.25,
            },
            "& .MuiTableRow-root:last-child .MuiTableCell-root": {
              borderBottom: 0,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="col">
                Job title
              </TableCell>
              <TableCell component="th" scope="col" align="right">
                Avg salary
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topJobTitles.map((row) => (
              <TableRow key={row.job_title} hover>
                <TableCell>{row.job_title}</TableCell>
                <TableCell align="right">{formatSalaryValue(Number(row.avg_salary))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
