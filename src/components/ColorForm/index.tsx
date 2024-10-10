import { startTransition, useState } from "react";
import KeyColorInput from "@/components/HexInput";
import NumberInput from "@/components/NumberInput";
import HSLProvider from "@/components/ColorForm/hsl-provider";
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
    const form = formRef.current;

    if (form instanceof HTMLFormElement) {
      const formData = new FormData(form);
      startTransition(() => action(formData));
    }
  }

  return (
    <HSLProvider defaultValues={formState}>
      <form className={s.form} onSubmit={onSubmit} ref={formRef}>
        <KeyColorInput
          systemValues={formState}
          swatchColor={swatchColor}
          setSwatchColor={setSwatchColor}
        />
        <HSLHiddenInputs systemValues={formState} />
        <NumberInput
          key={formState.numColors}
          name="numColors"
          defaultValue={formState.numColors}
          min={3}
          max={23}
        >
          Palette Size
        </NumberInput>
        <NumberInput
          key={formState.keyIndex}
          name="keyIndex"
          defaultValue={formState.keyIndex}
          min={0}
          max={formState.numColors}
        >
          Key Index
        </NumberInput>
      </form>
    </HSLProvider>
  );
}

export default ColorForm;
