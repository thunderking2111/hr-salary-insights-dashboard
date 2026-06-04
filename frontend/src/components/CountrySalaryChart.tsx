import { alpha, useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Customized,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CountrySalaryInsight } from "../api/types";
import { topCountriesByAverageSalary } from "../utils/chartCountries";
import { formatSalaryAxisTick, formatSalaryValue } from "../utils/formatSalary";
import { createChartColumnHitAreas } from "./ChartColumnHitAreas";
import { createSelectableBarShape } from "./SelectableBarShape";

const CHART_LEFT_MARGIN = 72;

function toChartValue(salary: string): number {
  return Number(salary);
}

interface CountrySalaryChartProps {
  insights: CountrySalaryInsight[];
  onCountrySelect?: (country: string) => void;
}

export function CountrySalaryChart({ insights, onCountrySelect }: CountrySalaryChartProps) {
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

  const barShape = useMemo(
    () => createSelectableBarShape(onCountrySelect),
    [onCountrySelect],
  );
  const tooltipCursorFill = useMemo(
    () => alpha(theme.palette.primary.main, 0.08),
    [theme],
  );
  const chartColumnHitAreas = useMemo(
    () => createChartColumnHitAreas(onCountrySelect),
    [onCountrySelect],
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
          <Tooltip
            formatter={(value: number) => formatSalaryValue(value)}
            cursor={{ fill: tooltipCursorFill, stroke: "none" }}
          />
          <Legend />
          <Bar
            dataKey="min"
            name="Min salary"
            fill={theme.palette.primary.light}
            isAnimationActive={false}
            shape={barShape}
          />
          <Bar
            dataKey="avg"
            name="Avg salary"
            fill={theme.palette.primary.main}
            isAnimationActive={false}
            shape={barShape}
          />
          <Bar
            dataKey="max"
            name="Max salary"
            fill={theme.palette.primary.dark}
            isAnimationActive={false}
            shape={barShape}
          />
          <Customized component={chartColumnHitAreas} />
        </BarChart>
      </ResponsiveContainer>
    </figure>
  );
}
