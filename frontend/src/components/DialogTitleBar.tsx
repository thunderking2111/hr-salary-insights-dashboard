import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { dialogCloseButtonSx, dialogTitleSx } from "./dialogLayout";

interface DialogTitleBarProps {
  id: string;
  title: string;
  onClose: () => void;
}

export function DialogTitleBar({ id, title, onClose }: DialogTitleBarProps) {
  return (
    <DialogTitle id={id} sx={dialogTitleSx}>
      {title}
      <IconButton aria-label="Close" onClick={onClose} sx={dialogCloseButtonSx}>
        <CloseIcon sx={{ fontSize: 28 }} />
      </IconButton>
    </DialogTitle>
  );
}
