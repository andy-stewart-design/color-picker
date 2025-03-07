import clsx from "clsx";
import type { ColorDefinition } from "@/types";
import s from "./style.module.css";
import { useRef, useState } from "react";
import VisuallyHidden from "../VisuallyHidden";

interface Props {
  color: ColorDefinition | undefined;
  name: number;
  isKeyIndex: boolean;
  showIndicator?: boolean;
  disabled: boolean;
}

function ColorCard({
  color,
  name,
  isKeyIndex,
  showIndicator,
  disabled,
}: Props) {
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
        <HexButton hex={color?.hex} name={name} disabled={disabled} />
        {isKeyIndex && (
          <div className={s.check} aria-hidden="true">
            <svg viewBox="0 0 20 20" width={20} height={20}>
              <path
                d="M 4.5 10.5 L 8.5 14.5 L 14.5 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <VisuallyHidden>Key Index</VisuallyHidden>
          </div>
        )}
      </div>
      {showIndicator && (
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

function HexButton({
  hex,
  name,
  disabled,
}: {
  hex?: string;
  name: number;
  disabled: boolean;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [success, setSuccess] = useState(false);

  function handleClick() {
    if (!hex || timer.current || !("navigator" in window)) return;

    navigator.clipboard.writeText(hex);
    setSuccess(true);

    timer.current = setTimeout(() => {
      setSuccess(false);
      timer.current = null;
    }, 2000);
  }

  return (
    <button onClick={handleClick} disabled={disabled}>
      {name ?? "000"}: {success ? "Copied!" : hex ? hex : "#000000"}
    </button>
  );
}

export default ColorCard;
