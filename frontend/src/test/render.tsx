import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";
import { AppShell } from "../components/AppShell";
import { EmployeesPage } from "../pages/EmployeesPage";
import { InsightsCountriesPage } from "../pages/InsightsCountriesPage";
import { InsightsPage } from "../pages/InsightsPage";
import {
  BackendHealthProvider,
  TEST_BACKEND_HEALTH_POLL_MS,
} from "../context/BackendHealthProvider";
import { AppThemeProvider } from "../theme/AppThemeProvider";

interface Options extends Omit<RenderOptions, "wrapper"> {
  route?: string;
}

export function renderWithProviders(ui: ReactElement, { route = "/", ...options }: Options = {}) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppThemeProvider>
        <BackendHealthProvider pollMs={TEST_BACKEND_HEALTH_POLL_MS}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </BackendHealthProvider>
      </AppThemeProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export function renderEmployeesPage(route = "/employees") {
  return renderWithProviders(<EmployeesPage />, { route });
}

export function renderInsightsPage(route = "/insights") {
  return renderWithProviders(<InsightsPage />, { route });
}

export function renderInsightsCountriesPage(route = "/insights/countries") {
  return renderWithProviders(<InsightsCountriesPage />, { route });
}

export function renderInsightsApp(route = "/insights") {
  return renderWithProviders(
    <Routes>
      <Route element={<AppShell />}>
        <Route path="insights" element={<InsightsPage />} />
        <Route path="insights/countries" element={<InsightsCountriesPage />} />
      </Route>
    </Routes>,
    { route },
  );
}
