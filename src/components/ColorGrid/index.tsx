import { useEffect, useState, type CSSProperties } from "react";
import ColorCard from "@/components/ColorCard";
import { CARD_IDS } from "@/constants";
import type { ColorDefinition } from "@/App";
import s from "./style.module.css";

interface Props {
  colors: ColorDefinition[];
  numColors: number;
  keyIndex: number;
}

function ColorGrid({ colors, numColors, keyIndex }: Props) {
  const [showIndicators, setShowIndicators] = useState(false);
  const activeRows = Array.from({ length: numColors }, () => "1fr");
  const inactiveRows = Array.from({ length: 23 - numColors }, () => "0fr");

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

  return (
    <section className={s.gridWrapper}>
      <div
        className={s.grid}
        style={
          {
            gridTemplateRows: [...activeRows, ...inactiveRows].join(" "),
            "--num-colors": numColors,
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
            data-active={index < numColors}
          >
            <ColorCard
              color={colors[index]}
              isKeyIndex={index === keyIndex}
              showIndicator={showIndicators}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ColorGrid;
