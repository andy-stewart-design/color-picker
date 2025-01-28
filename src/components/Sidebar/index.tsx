import { useState } from "react";
import { Trigger as DialogTrigger } from "@radix-ui/react-dialog";
import KeyColorInput from "@/components/HexInput";
import NumberInput from "@/components/NumberInput";
import HSLProvider from "@/components/Sidebar/hsl-provider";
import HSLHiddenInputs from "@/components/Sidebar/hsl-hidden-inputs";
import { useFormContext } from "@/components/Providers/FormProvider";
import { useActionContext } from "../Providers/ActionProvider";
import s from "./style.module.css";

interface Props {
  keyIndex: number;
}

function Sidebar({ keyIndex }: Props) {
  const { color, updateColor } = useActionContext();
  const [swatchColor, setSwatchColor] = useState(`#${color.hex}`);
  const formRef = useFormContext();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
  }

  return (
    <div className={s.sidebar}>
      <HSLProvider defaultValues={color}>
        <form className={s.form} onSubmit={onSubmit} ref={formRef}>
          <KeyColorInput
            systemValues={color}
            swatchColor={swatchColor}
            setSwatchColor={setSwatchColor}
          />
          <HSLHiddenInputs systemValues={color} />
          <NumberInput
            key={`numColors-${color.numColors}`}
            name="numColors"
            defaultValue={color.numColors}
            min={3}
            max={23}
            onSubmit={() => updateColor("numColors")}
          >
            Palette Size
          </NumberInput>
          <NumberInput
            key={`keyIndex-${keyIndex}`}
            name="keyIndex"
            defaultValue={keyIndex}
            min={0}
            max={color.numColors - 1}
            onSubmit={() => updateColor("keyIndex")}
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
