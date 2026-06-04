const BAR_TOP_RADIUS = 6;

interface SelectableBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  country?: string;
  payload?: {
    country?: string;
  };
}

export function createSelectableBarShape(onCountrySelect?: (country: string) => void) {
  return function SelectableBarShape(props: unknown) {
    const { x = 0, y = 0, width = 0, height = 0, fill, payload, country: countryProp } =
      props as SelectableBarShapeProps;
    const country = payload?.country ?? countryProp;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={BAR_TOP_RADIUS}
        ry={BAR_TOP_RADIUS}
        data-country={country}
        style={{ cursor: country ? "pointer" : undefined }}
        onClick={(event) => {
          event.stopPropagation();
          if (country) {
            onCountrySelect?.(country);
          }
        }}
      />
    );
  };
}
