import ColorCard from "@/components/ColorCard";
import { CARD_IDS } from "@/constants";
import type { CSSProperties } from "react";
import type { ColorDefinition } from "@/App";
import s from "./style.module.css";

interface Props {
  colors: ColorDefinition[];
  numColors: number;
  keyIndex: number;
}

function ColorGrid({ colors, numColors, keyIndex }: Props) {
  const activeRows = Array.from({ length: numColors }, () => "1fr");
  const inactiveRows = Array.from({ length: 23 - numColors }, () => "0fr");

  return (
    <section
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
            isKeyIndex={index === numColors - 1 - keyIndex}
          />
        </div>
      ))}
    </section>
  );
}

export default ColorGrid;
