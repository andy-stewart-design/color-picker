"use client";

import clsx from "clsx";
import type { ColorDefinition } from "@/App";
import s from "./style.module.css";

interface Props {
  color: ColorDefinition | undefined;
  isKeyIndex: boolean;
}

function ColorCard({ color, isKeyIndex }: Props) {
  const showIndicators = false;

  const style = color
    ? {
        backgroundColor: color.hex,
        "--saturation": `${color.s * 100}%`,
        "--lightness": `${color.l * 100}%`,
      }
    : {
        backgroundColor: "black",
        "--saturation": 0,
        "--lightness": 0,
      };

  return (
    <div className={s.card} style={style} data-active={color ? true : false}>
      <div className={s.hex}>
        <button>{color ? color.hex : "#000000"}</button>
      </div>
      {showIndicators && (
        <div className={s.indicators}>
          <span
            className={clsx(s.indicator, s.lightness, isKeyIndex && s.keyIndex)}
          />
          <span
            className={clsx(
              s.indicator,
              s.saturation,
              isKeyIndex && s.keyIndex
            )}
          />
        </div>
      )}
    </div>
  );
}

export default ColorCard;
