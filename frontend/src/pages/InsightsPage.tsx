import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSalaryByCountry } from "../api/client";
import type { CountrySalaryInsight } from "../api/types";
import { ChartJobTitlesTable } from "../components/ChartJobTitlesTable";
import { CountrySalaryChart } from "../components/CountrySalaryChart";
import { JobTitlesDialog } from "../components/JobTitlesDialog";
import { useChartCountryJobTitles } from "../hooks/useChartCountryJobTitles";
import { firstChartCountry } from "../utils/chartCountries";

export function InsightsPage() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<CountrySalaryInsight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const {
    chartCountry,
    setChartCountry,
    tableCountry,
    chartJobTitles,
    dialogOpen,
    loading,
    error: chartJobTitlesError,
    selectChartCountry,
    openJobTitlesDialog,
    closeJobTitlesDialog,
  } = useChartCountryJobTitles();

  useEffect(() => {
    void fetchSalaryByCountry()
      .then((data) => {
        setInsights(data);
        setChartCountry(firstChartCountry(data));
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load salary insights");
      });
  }, [setChartCountry]);

  return (
    <div>
      <h1>Salary Insights</h1>
      {error && <p role="alert">{error}</p>}
      <Box component="section">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography component="h2" variant="subtitle1">
            Salary by country (top 8)
          </Typography>
          <Button variant="text" onClick={() => navigate("/insights/countries")}>
            View all
          </Button>
        </Box>
        <CountrySalaryChart insights={insights} onCountrySelect={selectChartCountry} />
      </Box>
      {chartCountry && chartJobTitlesError && (
        <Alert severity="error" role="alert" sx={{ mt: 3 }}>
          {chartJobTitlesError}
        </Alert>
      )}
      {tableCountry && !chartJobTitlesError && chartJobTitles.length > 0 && (
        <ChartJobTitlesTable
          country={tableCountry}
          jobTitles={chartJobTitles}
          onViewAllJobTitles={openJobTitlesDialog}
        />
      )}
      <JobTitlesDialog
        country={chartCountry}
        jobTitles={chartJobTitles}
        open={dialogOpen}
        loading={loading}
        error={chartJobTitlesError}
        onClose={closeJobTitlesDialog}
      />
    </div>
  );
}
