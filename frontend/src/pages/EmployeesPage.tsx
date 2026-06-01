import { useEffect, useState } from "react";
import { fetchEmployees } from "../api/client";
import type { Employee } from "../api/types";

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchEmployees(1)
      .then((data) => setEmployees(data.results))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load employees");
      });
  }, []);

  return (
    <div>
      <h1>Employees</h1>
      {error && <p role="alert">{error}</p>}
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.full_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
