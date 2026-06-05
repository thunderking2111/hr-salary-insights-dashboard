import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useBackendHealth, type BackendHealthStatus } from "../hooks/useBackendHealth";

const DOT_COLORS: Record<BackendHealthStatus, string> = {
  checking: "warning.main",
  online: "success.main",
  offline: "error.main",
};

export function BackendStatusIndicator() {
  const { status, label } = useBackendHealth();

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        px: 2,
        py: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexShrink: 0,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: DOT_COLORS[status],
          ...(status === "checking" && {
            animation: "backendStatusPulse 1.5s ease-in-out infinite",
            "@keyframes backendStatusPulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.4 },
            },
          }),
        }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        {label}
      </Typography>
    </Box>
  );
}
