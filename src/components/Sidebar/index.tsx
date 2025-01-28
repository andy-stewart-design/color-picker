import { useState } from "react";
import { Trigger as DialogTrigger } from "@radix-ui/react-dialog";
import KeyColorInput from "@/components/HexInput";
import NumberInput from "@/components/NumberInput";
import HSLProvider from "@/components/Sidebar/hsl-provider";
import HSLHiddenInputs from "@/components/Sidebar/hsl-hidden-inputs";
import { useFormContext } from "@/components/Providers/FormProvider";
import { useActionContext } from "../Providers/ActionProvider";
import s from "./style.module.css";
import { useColorContext } from "../Providers/ColorProvider";

function Sidebar() {
  const { updateColor } = useActionContext();
  const { colorFormData } = useColorContext();
  const [swatchColor, setSwatchColor] = useState(`#${colorFormData.hex}`);
  const formRef = useFormContext();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
  }

  return (
    <div className={s.sidebar}>
      <HSLProvider defaultValues={colorFormData}>
        <form className={s.form} onSubmit={onSubmit} ref={formRef}>
          <KeyColorInput
            systemValues={colorFormData}
            swatchColor={swatchColor}
            setSwatchColor={setSwatchColor}
          />
          <HSLHiddenInputs systemValues={colorFormData} />
          <NumberInput
            key={`numColors-${colorFormData.numColors}`}
            name="numColors"
            defaultValue={colorFormData.numColors}
            min={3}
            max={23}
            onSubmit={() => updateColor("numColors")}
          >
            Palette Size
          </NumberInput>
          <NumberInput
            key={`keyIndex-${colorFormData.keyIndex}`}
            name="keyIndex"
            defaultValue={colorFormData.keyIndex}
            min={0}
            max={colorFormData.numColors - 1}
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
