import { useEffect, useState, type CSSProperties } from "react";
import ColorCard from "@/components/ColorCard";
import { useActionContext } from "@/components/Providers/ActionProvider";
import { CARD_IDS } from "@/constants";
import s from "./style.module.css";

function ColorGrid() {
  const { keyColor, colors, colorNames } = useActionContext();
  const [showIndicators, setShowIndicators] = useState(false);
  const activeRows = Array.from({ length: keyColor.numColors }, () => "1fr");
  const inactiveRows = Array.from(
    { length: 23 - keyColor.numColors },
    () => "0fr"
  );

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
            "--num-colors": keyColor.numColors,
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
            data-active={index < keyColor.numColors}
          >
            <ColorCard
              color={colors[index]}
              name={colorNames[index]}
              isKeyIndex={index === keyColor.keyIndex}
              showIndicator={showIndicators}
              disabled={index >= keyColor.numColors}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ColorGrid;
