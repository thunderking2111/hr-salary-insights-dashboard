interface ChartOffset {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TooltipTick {
  value?: string;
  coordinate?: number;
}

export interface ChartColumnHitAreasProps {
  offset?: ChartOffset;
  tooltipTicks?: TooltipTick[];
  tooltipAxisBandSize?: number;
  data?: Array<{ country: string }>;
  onCountrySelect?: (country: string) => void;
}

/** Full category-band click targets (same width as the tooltip hover band). */
export function ChartColumnHitAreas({
  offset,
  tooltipTicks,
  tooltipAxisBandSize,
  data,
  onCountrySelect,
}: ChartColumnHitAreasProps) {
  if (!onCountrySelect || !offset || !data?.length || !tooltipTicks?.length) {
    return null;
  }

  const bandSize = tooltipAxisBandSize ?? 0;
  if (bandSize <= 0) {
    return null;
  }

  const halfBand = bandSize / 2;

  return (
    <g className="chart-column-hit-areas">
      {data.map((row) => {
        const tick = tooltipTicks.find((item) => item.value === row.country);
        if (tick?.coordinate == null) {
          return null;
        }

        return (
          <rect
            key={row.country}
            x={tick.coordinate - halfBand}
            y={offset.top}
            width={bandSize}
            height={offset.height}
            fill="transparent"
            data-chart-column={row.country}
            style={{ cursor: "pointer" }}
            onClick={(event) => {
              event.stopPropagation();
              onCountrySelect(row.country);
            }}
          />
        );
      })}
    </g>
  );
}
