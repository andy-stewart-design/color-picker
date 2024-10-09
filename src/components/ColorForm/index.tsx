import { startTransition, useState } from "react";
import { HexInput, HexInputWrapper } from "@/components/HexInput";
import NumberInput from "@/components/NumberInput";
import HSLProvider from "@/components/ColorForm/hsl-provider";
import HSLPopover from "@/components/ColorForm/hsl-popover";
import HSLHiddenInputs from "@/components/ColorForm/hsl-hidden-inputs";
import { useFormContext } from "@/components/Providers/FormProvider";
import type { ColorFormValues } from "@/App";
import s from "./style.module.css";

interface Props {
  action: (payload: FormData) => void;
  formState: ColorFormValues;
}

function ColorForm({ formState, action }: Props) {
  const [swatchColor, setSwatchColor] = useState(`#${formState.hex}`);
  const formRef = useFormContext();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const form = event.target;

    if (form instanceof HTMLFormElement) {
      const formData = new FormData(form);
      startTransition(() => action(formData));
    }
  }

  return (
    <HSLProvider defaultValues={formState}>
      <form className={s.form} onSubmit={onSubmit} ref={formRef}>
        <NumberInput
          key={formState.numColors}
          name="numColors"
          defaultValue={formState.numColors}
          min={3}
          max={23}
          formRef={formRef}
        >
          Palette Size
        </NumberInput>
        <HexInputWrapper>
          <HSLPopover
            systemValues={formState}
            swatchColor={swatchColor}
            setSwatchColor={setSwatchColor}
          />
          <HexInput
            key={`hidden-${formState.hex}`}
            name="hex"
            defaultValue={formState.hex}
            formRef={formRef}
            setSwatchColor={setSwatchColor}
          />
        </HexInputWrapper>
        <HSLHiddenInputs systemValues={formState} />
      </form>
    </HSLProvider>
  );
}

export default ColorForm;
