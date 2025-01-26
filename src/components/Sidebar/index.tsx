import { startTransition, useState } from "react";
import { Trigger as DialogTrigger } from "@radix-ui/react-dialog";
import KeyColorInput from "@/components/HexInput";
import NumberInput from "@/components/NumberInput";
import HSLProvider from "@/components/Sidebar/hsl-provider";
import HSLHiddenInputs from "@/components/Sidebar/hsl-hidden-inputs";
import { useFormContext } from "@/components/Providers/FormProvider";
import type { ColorFormValues } from "@/App";
import s from "./style.module.css";

interface Props {
  action: (payload: FormData) => void;
  formState: ColorFormValues;
}

function Sidebar({ formState, action }: Props) {
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
    <div className={s.sidebar}>
      <HSLProvider defaultValues={formState}>
        <form className={s.form} onSubmit={onSubmit} ref={formRef}>
          <KeyColorInput
            systemValues={formState}
            swatchColor={swatchColor}
            setSwatchColor={setSwatchColor}
          />
          <HSLHiddenInputs systemValues={formState} />
          <NumberInput
            key={`numColors-${formState.numColors}`}
            name="numColors"
            defaultValue={formState.numColors}
            min={3}
            max={23}
          >
            Palette Size
          </NumberInput>
          <NumberInput
            key={`keyIndex-${formState.keyIndex}`}
            name="keyIndex"
            defaultValue={formState.keyIndex}
            min={0}
            max={formState.numColors - 1}
          >
            Key Index
          </NumberInput>
        </form>
        <div className={s.exportTrigger}>
          <DialogTrigger>Export palette</DialogTrigger>
        </div>
      </HSLProvider>
    </div>
  );
}

export default Sidebar;
