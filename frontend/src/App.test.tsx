import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the application root so the scaffolded app can run", () => {
    render(<App />);

    expect(screen.getByTestId("app-root")).toBeInTheDocument();
  });
});
