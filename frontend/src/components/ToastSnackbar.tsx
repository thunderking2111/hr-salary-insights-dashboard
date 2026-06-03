import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import type { ToastSeverity } from "../hooks/useSnackbarToast";

interface ToastSnackbarProps {
  open: boolean;
  message: string;
  severity: ToastSeverity;
  onClose: () => void;
}

export function ToastSnackbar({ open, message, severity, onClose }: ToastSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      data-testid="app-toast"
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
