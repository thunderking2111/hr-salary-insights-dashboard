import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { NavLink, Outlet } from "react-router-dom";

const drawerWidth = 240;

export function AppShell() {
  return (
    <Box sx={{ display: "flex" }}>
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
              position: "relative",
            },
          }}
        >
          <List component="nav" aria-label="Primary navigation">
            <ListItemButton component={NavLink} to="/employees">
              <ListItemText primary="Employees" />
            </ListItemButton>
            <ListItemButton component={NavLink} to="/insights">
              <ListItemText primary="Salary Insights" />
            </ListItemButton>
          </List>
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
