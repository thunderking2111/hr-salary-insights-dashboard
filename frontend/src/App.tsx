import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { EmployeesPage } from "./pages/EmployeesPage";

export default function App() {
  return (
    <div data-testid="app-root">
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/employees" replace />} />
            <Route path="employees" element={<EmployeesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
