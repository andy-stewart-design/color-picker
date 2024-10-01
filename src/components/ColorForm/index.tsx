import {
  startTransition,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { formatHex } from "culori";
import HexInput from "@/components/HexInput";
import RangeSlider from "@/components/Slider";
import type { ColorDefinition } from "@/App";
// import s from "./style.module.css";

interface Props {
  action: (payload: FormData) => void;
  formState: ColorDefinition;
  swatchColor: string;
  setSwatchColor: Dispatch<SetStateAction<string>>;
}

function ColorForm({ formState, action, swatchColor, setSwatchColor }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const form = event.target;
    if (form instanceof HTMLFormElement) {
      const formData = new FormData(form);
      startTransition(() => action(formData));
    }
  }

  function updateCurrentColor(key: "h" | "s" | "l", value: number) {
    const currentHsl = {
      h: formState.h,
      s: formState.s,
      l: formState.l,
    };
    return formatHex({
      ...currentHsl,
      mode: "hsl",
      [key]: value,
    });
  }

  return (
    <form onSubmit={onSubmit} ref={formRef}>
      <HexInput
        name="hex"
        swatchColor={swatchColor}
        defaultValue={formState.hex}
        form={formRef}
      />
      <RangeSlider
        name="hue"
        label="Hue"
        defaultValue={formState.h}
        min={0}
        max={360}
        step={0.01}
        onChange={(value) => setSwatchColor(updateCurrentColor("h", value))}
        onChangeEnd={() => formRef.current?.requestSubmit()}
      />
      <RangeSlider
        name="saturation"
        label="Saturation"
        defaultValue={formState.s}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => setSwatchColor(updateCurrentColor("s", value))}
        onChangeEnd={() => formRef.current?.requestSubmit()}
      />
      <RangeSlider
        name="lightness"
        label="Lightness"
        defaultValue={formState.l}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => setSwatchColor(updateCurrentColor("l", value))}
        onChangeEnd={() => formRef.current?.requestSubmit()}
      />
    </form>
  );
}

export default ColorForm;
