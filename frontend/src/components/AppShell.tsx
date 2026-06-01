import { NavLink, Outlet } from "react-router-dom";

export function AppShell() {
  return (
    <div>
      <nav aria-label="Main">
        <NavLink to="/employees">Employees</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
