import { useEffect, useState } from "react";
import { fetchSalaryByCountry } from "../api/client";
import type { CountrySalaryInsight } from "../api/types";

export function InsightsPage() {
  const [insights, setInsights] = useState<CountrySalaryInsight[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchSalaryByCountry()
      .then((data) => setInsights(data))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load salary insights");
      });
  }, []);

  return (
    <div>
      <h1>Salary Insights</h1>
      {error && <p role="alert">{error}</p>}
      <table>
        <thead>
          <tr>
            <th scope="col">Country</th>
            <th scope="col">Min salary</th>
            <th scope="col">Max salary</th>
            <th scope="col">Avg salary</th>
          </tr>
        </thead>
        <tbody>
          {insights.map((row) => (
            <tr key={row.country}>
              <td>{row.country}</td>
              <td>{row.min_salary}</td>
              <td>{row.max_salary}</td>
              <td>{row.avg_salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
