import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { EmployeesPage } from "./pages/EmployeesPage";
import { InsightsPage } from "./pages/InsightsPage";

export default function App() {
  return (
    <div data-testid="app-root">
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/employees" replace />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="insights" element={<InsightsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
