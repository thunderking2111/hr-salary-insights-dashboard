import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderEmployeesPage } from "../test/render";
import { stubDelayedEmployeesFailThenOk, stubHealthFailThenOk } from "../test/stubOfflineRecovery";
import { stubCreateEmployeeValidationError } from "../test/stubCreateEmployeeValidationError";
import { stubSlowFailingCreateEmployee } from "../test/stubSlowFailingCreateEmployee";
import { stubSlowFailingDeleteEmployee } from "../test/stubSlowFailingDeleteEmployee";
import { stubSlowFailingUpdateEmployee } from "../test/stubSlowFailingUpdateEmployee";
import { stubDelayedEmployeesList } from "../test/delayedEmployeesList";
import { stubDelayedPageTwoEmployees, stubTwoPageEmployeesList } from "../test/twoPageEmployees";

async function expectSuccessToast(message: string) {
  await waitFor(() => {
    expect(within(screen.getByTestId("app-toast")).getByRole("alert")).toHaveTextContent(message);
  });
}

async function expectErrorToast(message: string) {
  await waitFor(() => {
    expect(within(screen.getByTestId("app-toast")).getByRole("alert")).toHaveTextContent(message);
  });
}

describe("EmployeesPage", () => {
  describe("backend offline recovery", () => {
    it("loads employees after the backend comes online following an initial failure", async () => {
      stubHealthFailThenOk(1);
      stubDelayedEmployeesFailThenOk(0, 1);
      renderEmployeesPage();

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      });
    });

    it("retries once when a pending employee request fails after the backend comes online", async () => {
      stubHealthFailThenOk(1);
      stubDelayedEmployeesFailThenOk(150, 1);
      renderEmployeesPage();

      await waitFor(
        () => {
          expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  });

  it("shows centered loading spinner in the list region on initial fetch", async () => {
    stubDelayedEmployeesList();
    renderEmployeesPage();

    expect(screen.getByRole("progressbar", { name: /loading employees/i })).toBeInTheDocument();
    expect(screen.queryByRole("table", { name: /employees/i })).not.toBeInTheDocument();

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("progressbar", { name: /loading employees/i })).not.toBeInTheDocument();
    });
  });

  it("shows centered loading spinner over the table while paginating", async () => {
    stubDelayedPageTwoEmployees();
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");

    fireEvent.click(screen.getByRole("button", { name: /go to next page/i }));

    expect(screen.getByRole("progressbar", { name: /loading employees/i })).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();

    expect(await screen.findByText("Grace Hopper")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("progressbar", { name: /loading employees/i })).not.toBeInTheDocument();
    });
  });

  it("renders employee rows from the API", async () => {
    renderEmployeesPage();

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
  });

  it("renders employee profile columns from the API", async () => {
    renderEmployeesPage();

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("India")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("1500000.00")).toBeInTheDocument();
  });

  it("renders employee directory in a MUI table with accessible name", async () => {
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    const table = screen.getByRole("table", { name: /employees/i });
    expect(table.className).toMatch(/MuiTable-root/);
  });

  it("renders edit and delete row actions as MUI icon buttons", async () => {
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    const editButton = screen.getByRole("button", { name: /edit ada lovelace/i });
    const deleteButton = screen.getByRole("button", { name: /delete ada lovelace/i });
    expect(editButton.className).toMatch(/MuiIconButton-root/);
    expect(deleteButton.className).toMatch(/MuiIconButton-root/);
  });

  it("renders Add Employee as a contained primary MUI button", async () => {
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    const addButton = screen.getByRole("button", { name: /add employee/i });
    expect(addButton.className).toMatch(/MuiButton-contained/);
    expect(addButton.className).toMatch(/MuiButton-colorPrimary/);
  });

  it("opens add employee dialog when Add Employee is clicked", async () => {
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    expect(screen.getByRole("dialog", { name: /add employee/i })).toBeInTheDocument();
  });

  it("closes add employee dialog via Cancel or Close", async () => {
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));
    expect(screen.getByRole("dialog", { name: /add employee/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^cancel$/i }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /add employee/i })).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));
    fireEvent.click(screen.getByRole("button", { name: /^close$/i }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /add employee/i })).not.toBeInTheDocument();
    });
  });

  it("opens add employee dialog as MUI Dialog", async () => {
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    const dialog = screen.getByRole("dialog", { name: /add employee/i });
    expect(dialog.className).toMatch(/MuiDialog-paper/);
  });

  it("prefills India and INR defaults in add employee dialog", async () => {
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    const dialog = screen.getByRole("dialog", { name: /add employee/i });
    expect(within(dialog).getByLabelText(/country/i)).toHaveValue("India");
    expect(within(dialog).getByLabelText(/currency/i)).toHaveValue("INR");
  });

  it("shows client validation errors on add employee dialog fields", async () => {
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    const dialog = screen.getByRole("dialog", { name: /add employee/i });
    fireEvent.change(within(dialog).getByLabelText(/first name/i), {
      target: { value: "Incomplete" },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: /^save$/i }));

    expect(await within(dialog).findByText("Last name is required")).toBeInTheDocument();
    expect(within(dialog).getByText("Department is required")).toBeInTheDocument();
    expect(screen.queryByText(/\{"last_name"/)).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: /add employee/i })).toBeInTheDocument();
  });

  it("shows server validation errors on add employee dialog fields", async () => {
    stubCreateEmployeeValidationError();
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    const dialog = screen.getByRole("dialog", { name: /add employee/i });
    fireEvent.change(within(dialog).getByLabelText(/first name/i), { target: { value: "Grace" } });
    fireEvent.change(within(dialog).getByLabelText(/last name/i), { target: { value: "Hopper" } });
    fireEvent.change(within(dialog).getByLabelText(/email/i), {
      target: { value: "grace.hopper@example.com" },
    });
    fireEvent.change(within(dialog).getByLabelText(/job title/i), {
      target: { value: "Software Engineer" },
    });
    fireEvent.change(within(dialog).getByLabelText(/department/i), {
      target: { value: "Engineering" },
    });
    fireEvent.change(within(dialog).getByLabelText(/employment type/i), {
      target: { value: "full_time" },
    });
    fireEvent.change(within(dialog).getByLabelText(/^salary/i), { target: { value: "2000000.00" } });
    fireEvent.change(within(dialog).getByLabelText(/date of joining/i), {
      target: { value: "2021-06-01" },
    });

    fireEvent.click(within(dialog).getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(
        within(dialog).getByRole("textbox", { name: /department/i }),
      ).toHaveAccessibleErrorMessage(/this field may not be blank/i);
    });
    expect(screen.queryByText(/\{"last_name"/)).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: /add employee/i })).toBeInTheDocument();
  });

  it("adds an employee and refreshes the list", async () => {
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    const dialog = screen.getByRole("dialog", { name: /add employee/i });
    fireEvent.change(within(dialog).getByLabelText(/first name/i), { target: { value: "Grace" } });
    fireEvent.change(within(dialog).getByLabelText(/last name/i), { target: { value: "Hopper" } });
    fireEvent.change(within(dialog).getByLabelText(/email/i), {
      target: { value: "grace.hopper@example.com" },
    });
    fireEvent.change(within(dialog).getByLabelText(/job title/i), {
      target: { value: "Software Engineer" },
    });
    fireEvent.change(within(dialog).getByLabelText(/department/i), {
      target: { value: "Engineering" },
    });
    fireEvent.change(within(dialog).getByLabelText(/employment type/i), {
      target: { value: "full_time" },
    });
    fireEvent.change(within(dialog).getByLabelText(/^salary/i), { target: { value: "2000000.00" } });
    fireEvent.change(within(dialog).getByLabelText(/date of joining/i), {
      target: { value: "2021-06-01" },
    });

    fireEvent.click(within(dialog).getByRole("button", { name: /^save$/i }));

    expect(await screen.findByText("Grace Hopper")).toBeInTheDocument();
    await expectSuccessToast("Employee added");
  });

  it("opens edit employee dialog as MUI Dialog", async () => {
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /edit ada lovelace/i }));

    const dialog = screen.getByRole("dialog", { name: /edit employee/i });
    expect(dialog.className).toMatch(/MuiDialog-paper/);
  });

  it("updates an employee and refreshes the list", async () => {
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /edit ada lovelace/i }));

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Augusta" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Ada" } });

    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByText("Augusta Ada")).toBeInTheDocument();
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
    await expectSuccessToast("Employee updated");
  });

  it("opens delete employee confirm as MUI Dialog", async () => {
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /delete ada lovelace/i }));

    const dialog = screen.getByRole("dialog", { name: /delete employee/i });
    expect(dialog.className).toMatch(/MuiDialog-paper/);
  });

  it("deletes an employee and refreshes the list", async () => {
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /delete ada lovelace/i }));
    const dialog = screen.getByRole("dialog", { name: /delete employee/i });
    fireEvent.click(within(dialog).getByRole("button", { name: /^delete$/i }));

    await waitFor(() => {
      expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
    });
    await expectSuccessToast("Employee deleted");
  });

  it("shows error toast when add dialog closes before a failed save", async () => {
    stubSlowFailingCreateEmployee();
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    const dialog = screen.getByRole("dialog", { name: /add employee/i });
    fireEvent.change(within(dialog).getByLabelText(/first name/i), { target: { value: "Grace" } });
    fireEvent.change(within(dialog).getByLabelText(/last name/i), { target: { value: "Hopper" } });
    fireEvent.change(within(dialog).getByLabelText(/email/i), {
      target: { value: "grace.hopper@example.com" },
    });
    fireEvent.change(within(dialog).getByLabelText(/job title/i), {
      target: { value: "Software Engineer" },
    });
    fireEvent.change(within(dialog).getByLabelText(/department/i), {
      target: { value: "Engineering" },
    });
    fireEvent.change(within(dialog).getByLabelText(/employment type/i), {
      target: { value: "full_time" },
    });
    fireEvent.change(within(dialog).getByLabelText(/^salary/i), { target: { value: "2000000.00" } });
    fireEvent.change(within(dialog).getByLabelText(/date of joining/i), {
      target: { value: "2021-06-01" },
    });

    fireEvent.click(within(dialog).getByRole("button", { name: /^save$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^cancel$/i }));

    await expectErrorToast("Could not add employee");
    expect(screen.queryByText("Failed to add employee")).not.toBeInTheDocument();
  });

  it("shows error toast when edit dialog closes before a failed save", async () => {
    stubSlowFailingUpdateEmployee();
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /edit ada lovelace/i }));

    const dialog = screen.getByRole("dialog", { name: /edit employee/i });
    fireEvent.change(within(dialog).getByLabelText(/first name/i), { target: { value: "Augusta" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /^save$/i }));
    fireEvent.click(within(dialog).getByRole("button", { name: /^cancel$/i }));

    await expectErrorToast("Could not update employee");
  });

  it("shows error toast when delete dialog closes before a failed delete", async () => {
    stubSlowFailingDeleteEmployee();
    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /delete ada lovelace/i }));

    const dialog = screen.getByRole("dialog", { name: /delete employee/i });
    fireEvent.click(within(dialog).getByRole("button", { name: /^delete$/i }));
    fireEvent.click(within(dialog).getByRole("button", { name: /^cancel$/i }));

    await expectErrorToast("Could not delete employee");
  });

  it("renders employee list pagination as MUI TablePagination", async () => {
    stubTwoPageEmployeesList();

    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    const pagination = screen.getByRole("navigation", { name: /pagination/i });
    expect(pagination.className).toMatch(/MuiTablePagination-root/);
  });

  it("loads the next page of employees when Next page is clicked", async () => {
    stubTwoPageEmployeesList();

    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    expect(screen.queryByText("Grace Hopper")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /go to next page/i }));

    expect(await screen.findByText("Grace Hopper")).toBeInTheDocument();
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
  });

  it("loads the previous page of employees when Previous page is clicked", async () => {
    stubTwoPageEmployeesList();

    renderEmployeesPage();

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /go to next page/i }));
    await screen.findByText("Grace Hopper");

    fireEvent.click(screen.getByRole("button", { name: /go to previous page/i }));

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.queryByText("Grace Hopper")).not.toBeInTheDocument();
  });
});
