import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { BackendHealthProvider } from "./context/BackendHealthProvider";
import { AppShell } from "./components/AppShell";
import { EmployeesPage } from "./pages/EmployeesPage";
import { InsightsCountriesPage } from "./pages/InsightsCountriesPage";
import { InsightsPage } from "./pages/InsightsPage";

export default function App() {
  return (
    <div data-testid="app-root">
      <BrowserRouter>
        <BackendHealthProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Navigate to="/employees" replace />} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="insights/countries" element={<InsightsCountriesPage />} />
            </Route>
          </Routes>
        </BackendHealthProvider>
      </BrowserRouter>
    </div>
  );
}
