import { type CSSProperties } from "react";
import { roundTo } from "@/utils/math";

interface Props {
  hex: string;
  h: number;
  s: number;
  l: number;
  isKeyIndex: boolean;
}

function ColorCard({ hex, h, s, l, isKeyIndex }: Props) {
  return (
    <div
      className="color-card"
      style={
        {
          backgroundColor: hex,
          "--saturation": `${s * 100}%`,
          "--lightness": `${l * 100}%`,
        } as CSSProperties
      }
    >
      <ul>
        <li>{hex}</li>
        <li>h: {roundTo(h, 1)}</li>
        <li>s: {roundTo(s)}</li>
        <li>l: {roundTo(l)}</li>
      </ul>
      <div className="indicators">
        <span
          className={`indicator lightness ${isKeyIndex ? "anchor" : ""}`.trim()}
        />
        <span
          className={`indicator saturation ${
            isKeyIndex ? "anchor" : ""
          }`.trim()}
        />
      </div>
    </div>
  );
}

export default ColorCard;
