import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CountrySalaryInsight } from "../api/types";
import { formatSalaryAxisTick, formatSalaryValue } from "../utils/formatSalary";

const TOP_COUNTRY_COUNT = 8;
const BAR_TOP_RADIUS = 6;
const CHART_LEFT_MARGIN = 72;

function toChartValue(salary: string): number {
  return Number(salary);
}

function topCountriesByAverageSalary(insights: CountrySalaryInsight[]): CountrySalaryInsight[] {
  return [...insights]
    .sort((a, b) => toChartValue(b.avg_salary) - toChartValue(a.avg_salary))
    .slice(0, TOP_COUNTRY_COUNT);
}

interface CountrySalaryChartProps {
  insights: CountrySalaryInsight[];
}

export function CountrySalaryChart({ insights }: CountrySalaryChartProps) {
  const theme = useTheme();
  const chartData = useMemo(
    () =>
      topCountriesByAverageSalary(insights).map((row) => ({
        country: row.country,
        min: toChartValue(row.min_salary),
        avg: toChartValue(row.avg_salary),
        max: toChartValue(row.max_salary),
      })),
    [insights],
  );

  if (chartData.length === 0) {
    return null;
  }

  return (
    <figure aria-label="Average salary by country">
      <ResponsiveContainer
        width="100%"
        height={400}
        initialDimension={{ width: 800, height: 400 }}
      >
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 16, bottom: 8, left: CHART_LEFT_MARGIN }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="country" />
          <YAxis tickFormatter={formatSalaryAxisTick} width={CHART_LEFT_MARGIN} />
          <Tooltip formatter={(value: number) => formatSalaryValue(value)} />
          <Legend />
          <Bar
            dataKey="min"
            name="Min salary"
            fill={theme.palette.primary.light}
            radius={[BAR_TOP_RADIUS, BAR_TOP_RADIUS, 0, 0]}
          />
          <Bar
            dataKey="avg"
            name="Avg salary"
            fill={theme.palette.primary.main}
            radius={[BAR_TOP_RADIUS, BAR_TOP_RADIUS, 0, 0]}
          />
          <Bar
            dataKey="max"
            name="Max salary"
            fill={theme.palette.primary.dark}
            radius={[BAR_TOP_RADIUS, BAR_TOP_RADIUS, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </figure>
  );
}
