import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { alpha, type Theme } from "@mui/material/styles";
import { NavLink, Outlet } from "react-router-dom";

const drawerWidth = 240;

const navItemSx = {
  borderRadius: 2,
  mb: 0.5,
  color: "text.primary",
  "& .MuiListItemText-primary": {
    fontSize: 14,
    fontWeight: 500,
  },
  "&.Mui-selected": {
    backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.1),
    color: "primary.main",
    "&:hover": {
      backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.14),
    },
    "& .MuiListItemText-primary": {
      fontWeight: 600,
      color: "primary.main",
    },
  },
};

function SidebarBrand() {
  return (
    <Box
      sx={{
        px: 2,
        py: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        flexShrink: 0,
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: "primary.main",
          color: "common.white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: "-0.02em",
        }}
      >
        HP
      </Box>
      <Typography
        component="span"
        sx={{
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1.2,
          color: "text.primary",
          letterSpacing: "-0.02em",
        }}
      >
        HR Pulse
      </Typography>
    </Box>
  );
}

function SidebarNavItem({ to, label, end }: { to: string; label: string; end?: boolean }) {
  return (
    <NavLink to={to} end={end} style={{ textDecoration: "none", color: "inherit" }}>
      {({ isActive }) => (
        <ListItemButton selected={isActive} sx={navItemSx}>
          <ListItemText primary={label} />
        </ListItemButton>
      )}
    </NavLink>
  );
}

export function AppShell() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box
        component="aside"
        aria-label="Primary navigation"
        sx={{ width: drawerWidth, flexShrink: 0 }}
      >
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              minHeight: "100vh",
              borderRight: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <SidebarBrand />
          <List component="nav" aria-label="Primary navigation" sx={{ flex: 1, px: 1.5, py: 1 }}>
            <SidebarNavItem to="/employees" label="Employees" end />
            <SidebarNavItem to="/insights" label="Salary Insights" />
          </List>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: 3,
          overflowX: "auto",
          bgcolor: "background.default",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
