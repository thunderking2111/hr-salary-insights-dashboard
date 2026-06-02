import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";
import { AppThemeProvider } from "../theme/AppThemeProvider";

interface Options extends Omit<RenderOptions, "wrapper"> {
  route?: string;
}

export function renderWithProviders(ui: ReactElement, { route = "/", ...options }: Options = {}) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppThemeProvider>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </AppThemeProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
