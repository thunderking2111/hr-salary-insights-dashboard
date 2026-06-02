import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import type { Employee } from "../api/types";
import { DialogTitleBar } from "./DialogTitleBar";
import { dialogContentSx, dialogPaperSlotProps } from "./dialogLayout";

interface DeleteEmployeeDialogProps {
  employee: Employee | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteEmployeeDialog({ employee, onClose, onConfirm }: DeleteEmployeeDialogProps) {
  return (
    <Dialog
      open={employee !== null}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      aria-labelledby="delete-employee-title"
      aria-describedby="delete-employee-description"
      slotProps={dialogPaperSlotProps}
    >
      <DialogTitleBar
        id="delete-employee-title"
        title="Delete employee?"
        onClose={onClose}
      />
      <DialogContent sx={dialogContentSx}>
        {employee && (
          <DialogContentText id="delete-employee-description">
            Remove {employee.full_name} from the directory? This cannot be undone.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
