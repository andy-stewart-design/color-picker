import { startTransition, useRef, useState } from "react";
import { formatHex } from "culori";
import HexInput from "@/components/HexInput";
import RangeSlider from "@/components/RangeSlider";
import NumberInput from "@/components/NumberInput";
import type { ColorFormValues } from "@/App";
import s from "./style.module.css";

interface Props {
  action: (payload: FormData) => void;
  formState: ColorFormValues;
}

function ColorForm({ formState, action }: Props) {
  const [swatchColor, setSwatchColor] = useState(`#${formState.hex}`);
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
    <form className={s.form} onSubmit={onSubmit} ref={formRef}>
      <NumberInput
        name="numColors"
        defaultValue={formState.numColors}
        min={3}
        max={23}
        formRef={formRef}
      >
        Palette Size
      </NumberInput>
      <HexInput
        name="hex"
        defaultValue={formState.hex}
        swatchColor={swatchColor}
        formRef={formRef}
      />
      <RangeSlider
        name="hue"
        label="Hue"
        defaultValue={formState.h}
        min={0}
        max={360}
        step={0.01}
        onChange={(value) => setSwatchColor(updateCurrentColor("h", value))}
        onChangeEnd={(value) => {
          formRef.current?.requestSubmit();
          setSwatchColor(updateCurrentColor("h", value));
        }}
        formRef={formRef}
      />
      <RangeSlider
        name="saturation"
        label="Saturation"
        defaultValue={formState.s}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => setSwatchColor(updateCurrentColor("s", value))}
        onChangeEnd={(value) => {
          formRef.current?.requestSubmit();
          setSwatchColor(updateCurrentColor("s", value));
        }}
        formRef={formRef}
      />
      <RangeSlider
        name="lightness"
        label="Lightness"
        defaultValue={formState.l}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => setSwatchColor(updateCurrentColor("l", value))}
        onChangeEnd={(value) => {
          formRef.current?.requestSubmit();
          setSwatchColor(updateCurrentColor("l", value));
        }}
        formRef={formRef}
      />
    </form>
  );
}

export default ColorForm;
