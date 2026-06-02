import type { SxProps, Theme } from "@mui/material/styles";

export const dialogPaperSlotProps = {
  paper: {
    sx: { overflowX: "hidden" as const },
  },
};

export const dialogTitleSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "100%",
  overflow: "hidden",
  pr: 2,
};

export const dialogCloseButtonSx: SxProps<Theme> = {
  flexShrink: 0,
  color: "text.secondary",
  "&:hover": { color: "text.primary", bgcolor: "action.hover" },
};

export const dialogContentSx: SxProps<Theme> = {
  overflowX: "hidden",
  boxSizing: "border-box",
};
