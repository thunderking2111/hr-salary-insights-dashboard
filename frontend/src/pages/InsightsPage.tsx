import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSalaryByCountry, fetchSalaryByJobTitle } from "../api/client";
import type { CountrySalaryInsight, JobTitleSalaryInsight } from "../api/types";
import { ChartJobTitlesTable } from "../components/ChartJobTitlesTable";
import { CountrySalaryChart } from "../components/CountrySalaryChart";
import { JobTitlesDialog } from "../components/JobTitlesDialog";
import { firstChartCountry } from "../utils/chartCountries";

export function InsightsPage() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<CountrySalaryInsight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [chartCountry, setChartCountry] = useState<string | null>(null);
  const [chartJobTitles, setChartJobTitles] = useState<JobTitleSalaryInsight[]>([]);
  const [chartJobTitlesDialogOpen, setChartJobTitlesDialogOpen] = useState(false);

  useEffect(() => {
    void fetchSalaryByCountry()
      .then((data) => {
        setInsights(data);
        setChartCountry(firstChartCountry(data));
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load salary insights");
      });
  }, []);

  useEffect(() => {
    if (!chartCountry) {
      setChartJobTitles([]);
      return;
    }

    setChartJobTitles([]);
    setChartJobTitlesDialogOpen(false);

    void fetchSalaryByJobTitle(chartCountry)
      .then((data) => setChartJobTitles(data))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load job title insights");
      });
  }, [chartCountry]);

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
        <CountrySalaryChart insights={insights} onCountrySelect={setChartCountry} />
      </Box>
      {chartCountry && (
        <ChartJobTitlesTable
          country={chartCountry}
          jobTitles={chartJobTitles}
          onViewAllJobTitles={() => setChartJobTitlesDialogOpen(true)}
        />
      )}
      <JobTitlesDialog
        country={chartCountry}
        jobTitles={chartJobTitles}
        open={chartJobTitlesDialogOpen}
        onClose={() => setChartJobTitlesDialogOpen(false)}
      />
    </div>
  );
}
