import { useEffect, useState, type ReactNode } from "react";
import ColorCard from "@/components/ColorCard";
import { useColorContext } from "@/components/Providers/ColorProvider";
import { GRID_ROWS } from "@/constants";
import s from "./style.module.css";

function ColorGrid() {
  const { colorData, colors, colorNames } = useColorContext();
  const showIndicators = useToggleIndicators();

  return (
    <section className={s.gridWrapper}>
      <Grid numColors={colorData.numColors}>
        {GRID_ROWS.map(({ id }, index) => (
          <GridRow
            key={id}
            color={colors[index]?.hex}
            disabled={index >= colorData.numColors}
          >
            <ColorCard
              color={colors[index]}
              name={colorNames[index]}
              isKeyIndex={index === colorData.keyIndex}
              showIndicator={showIndicators}
              disabled={index >= colorData.numColors}
            />
          </GridRow>
        ))}
      </Grid>
    </section>
  );
}

export default ColorGrid;

// ----------------------------------------------------------------
// CHILD COMPONENTS
// ----------------------------------------------------------------
function Grid({
  numColors,
  children,
}: {
  numColors: number;
  children: ReactNode;
}) {
  const activeRows = Array.from({ length: numColors }, () => "1fr");
  const inactiveRows = Array.from({ length: 23 - numColors }, () => "0fr");

  return (
    <div
      className={s.grid}
      style={{
        "--gtr": [...activeRows, ...inactiveRows].join(" "),
        "--num-colors": numColors,
      }}
    >
      {children}
    </div>
  );
}

function GridRow({
  color,
  disabled,
  children,
}: {
  color?: string;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={s.cardWrapper}
      style={{
        "--background": color ? color : "black",
      }}
      data-active={!disabled}
      aria-hidden={disabled ? "true" : undefined}
    >
      {children}
    </div>
  );
}

// ----------------------------------------------------------------
// HELPER FUNTIONS
// ----------------------------------------------------------------
function useToggleIndicators() {
  const [showIndicators, setShowIndicators] = useState(false);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.metaKey && e.shiftKey && e.key === "g") {
        setShowIndicators((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return showIndicators;
}
