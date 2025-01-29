import { useEffect, useState, type CSSProperties } from "react";
import ColorCard from "@/components/ColorCard";
import { useColorContext } from "@/components/Providers/ColorProvider";
import { CARD_IDS } from "@/constants";
import s from "./style.module.css";

function ColorGrid() {
  const { colorData, colors, colorNames } = useColorContext();
  const showIndicators = useToggleIndicators();

  const activeRows = Array.from({ length: colorData.numColors }, () => "1fr");
  const inactiveRows = Array.from(
    { length: 23 - colorData.numColors },
    () => "0fr"
  );

  return (
    <section className={s.gridWrapper}>
      <div
        className={s.grid}
        style={
          {
            gridTemplateRows: [...activeRows, ...inactiveRows].join(" "),
            "--num-colors": colorData.numColors,
          } as CSSProperties
        }
      >
        {Array.from({ length: 23 }, (_, i) => i).map((index) => (
          <div
            key={CARD_IDS[index]}
            data-index={index}
            className={s.cardWrapper}
            style={
              {
                display: "grid",
                overflow: "hidden",
                "--background": colors[index] ? colors[index].hex : "black",
              } as CSSProperties
            }
            data-active={index < colorData.numColors}
          >
            <ColorCard
              color={colors[index]}
              name={colorNames[index]}
              isKeyIndex={index === colorData.keyIndex}
              showIndicator={showIndicators}
              disabled={index >= colorData.numColors}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ColorGrid;

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
