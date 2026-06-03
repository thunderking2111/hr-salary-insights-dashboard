import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { JobTitleSalaryInsight } from "../api/types";
import { formatSalaryValue } from "../utils/formatSalary";
import { jobTitlesByAverageSalary } from "../utils/jobTitleInsights";
import { DialogTitleBar } from "./DialogTitleBar";
import { dialogContentSx, dialogPaperSlotProps } from "./dialogLayout";

function jobTitlesTitleId(country: string): string {
  return `job-titles-${country.toLowerCase().replace(/\s+/g, "-")}-title`;
}

interface JobTitlesDialogProps {
  country: string | null;
  jobTitles: JobTitleSalaryInsight[];
  open: boolean;
  onClose: () => void;
}

export function JobTitlesDialog({ country, jobTitles, open, onClose }: JobTitlesDialogProps) {
  if (!country) {
    return null;
  }

  const titleId = jobTitlesTitleId(country);
  const sortedJobTitles = jobTitlesByAverageSalary(jobTitles);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      aria-labelledby={titleId}
      slotProps={dialogPaperSlotProps}
    >
      <DialogTitleBar id={titleId} title={`Job titles in ${country}`} onClose={onClose} />
      <DialogContent sx={dialogContentSx}>
        <TableContainer>
          <Table aria-label={`Job titles in ${country}`} size="small">
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
              {sortedJobTitles.map((row) => (
                <TableRow key={row.job_title} hover>
                  <TableCell>{row.job_title}</TableCell>
                  <TableCell align="right">{formatSalaryValue(Number(row.avg_salary))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
