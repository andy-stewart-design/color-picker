import { useHSLContext } from "./hsl-provider";

interface Props {
  systemValues: {
    h: number;
    s: number;
    l: number;
  };
  debug?: boolean;
}

function HSLHiddenInputs({ systemValues, debug = false }: Props) {
  const { hue, saturation, lightness } = useHSLContext();

  return (
    <>
      <input
        key={`hidden-hue-${systemValues.h}`}
        name="hue"
        type={debug ? "range" : "hidden"}
        onChange={() => {}}
        value={hue}
        min={0}
        max={360}
        step={0.01}
      />
      <input
        key={`hidden-saturation-${systemValues.s}`}
        name="saturation"
        type={debug ? "range" : "hidden"}
        onChange={() => {}}
        value={saturation}
        min={0}
        max={1}
        step={0.01}
      />
      <input
        key={`hidden-lightness-${systemValues.l}`}
        name="lightness"
        type={debug ? "range" : "hidden"}
        onChange={() => {}}
        value={lightness}
        min={0}
        max={1}
        step={0.01}
      />
    </>
  );
}

export default HSLHiddenInputs;
