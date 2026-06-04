import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const SPINNER_SIZE = 48;

interface CenteredLoadingSpinnerProps {
  label: string;
}

export function CenteredLoadingSpinner({ label }: CenteredLoadingSpinnerProps) {
  return (
    <CircularProgress
      color="primary"
      size={SPINNER_SIZE}
      thickness={4}
      aria-label={label}
    />
  );
}

/** Centers a spinner in a region with a stable minimum height (no background overlay). */
export function ListLoadingCenter({
  label,
  minHeight = "min(60vh, 520px)",
}: CenteredLoadingSpinnerProps & { minHeight?: number | string }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight,
        width: "100%",
      }}
    >
      <CenteredLoadingSpinner label={label} />
    </Box>
  );
}

/** Centers a spinner over existing content without dimming the background. */
export function ListLoadingIndicator({
  label,
  minHeight = "min(60vh, 520px)",
}: CenteredLoadingSpinnerProps & { minHeight?: number | string }) {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        pointerEvents: "none",
        minHeight,
      }}
    >
      <CenteredLoadingSpinner label={label} />
    </Box>
  );
}
