import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { fetchSalaryByCountry, fetchSalaryByJobTitle } from "../api/client";
import type { CountrySalaryInsight, JobTitleSalaryInsight } from "../api/types";
import { CountrySalaryTable } from "../components/CountrySalaryTable";
import { JobTitlesDialog } from "../components/JobTitlesDialog";
import {
  COUNTRIES_LIST_PAGE_SIZE,
  paginatedCountryInsights,
} from "../utils/countryInsightsPagination";

export function InsightsCountriesPage() {
  const [insights, setInsights] = useState<CountrySalaryInsight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [jobTitles, setJobTitles] = useState<JobTitleSalaryInsight[]>([]);

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

  const openCountryJobTitles = (country: string) => {
    setSelectedCountry(country);
    setJobTitles([]);
    void fetchSalaryByJobTitle(country)
      .then((data) => setJobTitles(data))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load job title insights");
      });
  };

  const closeCountryJobTitles = () => {
    setSelectedCountry(null);
    setJobTitles([]);
  };

  return (
    <div>
      <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Salary by country
      </Typography>
      {error && <p role="alert">{error}</p>}
      <CountrySalaryTable countries={pageCountries} onCountrySelect={openCountryJobTitles} />
      <JobTitlesDialog
        country={selectedCountry}
        jobTitles={jobTitles}
        open={selectedCountry !== null}
        onClose={closeCountryJobTitles}
      />
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
