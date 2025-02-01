import { useState, type FormEvent } from "react";
import { Trigger as DialogTrigger } from "@radix-ui/react-dialog";
import KeyColorInput from "@/components/HexInput";
import NumberInput from "@/components/NumberInput";
import HSLProvider from "@/components/Sidebar/hsl-provider";
import HSLHiddenInputs from "@/components/Sidebar/hsl-hidden-inputs";
import { useFormContext } from "@/components/Providers/FormProvider";
import { useColorContext } from "@/components/Providers/ColorProvider";
import SelectMenu from "@/components/SelectMenu";
import { useActionContext } from "@/components/Providers/ActionProvider";
import s from "./style.module.css";

function Sidebar() {
  const { updateColor } = useActionContext();
  const { colorData } = useColorContext();
  const formRef = useFormContext();

  const [swatchColor, setSwatchColor] = useState(`#${colorData.hex}`);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <div className={s.sidebar}>
      <HSLProvider defaultValues={colorData}>
        <form className={s.form} onSubmit={onSubmit} ref={formRef}>
          <KeyColorInput
            systemValues={colorData}
            swatchColor={swatchColor}
            setSwatchColor={setSwatchColor}
          />
          <HSLHiddenInputs systemValues={colorData} />
          <NumberInput
            key={`numColors-${colorData.numColors}`}
            name="numColors"
            defaultValue={colorData.numColors}
            min={3}
            max={23}
            onSubmit={() => updateColor("numColors")}
          >
            Palette Size
          </NumberInput>
          <NumberInput
            key={`keyIndex-${colorData.keyIndex}`}
            name="keyIndex"
            defaultValue={colorData.keyIndex}
            min={0}
            max={colorData.numColors - 1}
            onSubmit={() => updateColor("keyIndex")}
          >
            Key Index
          </NumberInput>
          <SelectMenu />
        </form>
        <div className={s.exportTrigger}>
          <DialogTrigger>Export palette</DialogTrigger>
        </div>
      </HSLProvider>
    </div>
  );
}

export default Sidebar;
