import { type CSSProperties } from "react";
import clsx from "clsx";
import s from "./style.module.css";

interface Props {
  hex: string;
  h: number;
  s: number;
  l: number;
  isKeyIndex: boolean;
}

function ColorCard({ hex, s: sat, l, isKeyIndex }: Props) {
  return (
    <div
      className={s.card}
      style={
        {
          backgroundColor: hex,
          "--saturation": `${sat * 100}%`,
          "--lightness": `${l * 100}%`,
        } as CSSProperties
      }
    >
      <div className={s.hex}>
        <button>{hex}</button>
      </div>
      <div className={s.indicators}>
        <span
          className={clsx(s.indicator, s.lightness, isKeyIndex && s.amchor)}
        />
        <span
          className={clsx(s.indicator, s.saturation, isKeyIndex && s.amchor)}
        />
      </div>
    </div>
  );
}

export default ColorCard;
