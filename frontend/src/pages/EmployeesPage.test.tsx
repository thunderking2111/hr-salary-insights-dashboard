import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmployeesPage } from "./EmployeesPage";

describe("EmployeesPage", () => {
  it("renders employee rows from the API", async () => {
    render(<EmployeesPage />);

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
  });
});
