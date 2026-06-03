import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { fetchSalaryByCountry } from "../api/client";
import type { CountrySalaryInsight } from "../api/types";
import { CountrySalaryTable } from "../components/CountrySalaryTable";
import {
  COUNTRIES_LIST_PAGE_SIZE,
  paginatedCountryInsights,
} from "../utils/countryInsightsPagination";

export function InsightsCountriesPage() {
  const [insights, setInsights] = useState<CountrySalaryInsight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    void fetchSalaryByCountry()
      .then((data) => {
        setInsights(data);
        setPage(0);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load salary insights");
      });
  }, []);

  const pageCountries = paginatedCountryInsights(insights, page);

  return (
    <div>
      <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Salary by country
      </Typography>
      {error && <p role="alert">{error}</p>}
      <CountrySalaryTable countries={pageCountries} />
      {insights.length > 0 && (
        <TablePagination
          component="div"
          role="navigation"
          aria-label="Salary by country pagination"
          count={insights.length}
          page={page}
          onPageChange={(_event, newPage) => setPage(newPage)}
          rowsPerPage={COUNTRIES_LIST_PAGE_SIZE}
          rowsPerPageOptions={[]}
        />
      )}
    </div>
  );
}
