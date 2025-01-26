import { Dispatch, SetStateAction } from "react";
import { formatHex } from "culori";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import RangeSlider from "@/components/RangeSlider";
import { useFormContext } from "@/components/Providers/FormProvider";
import { useHSLContext } from "@/components/Sidebar/hsl-provider";
import s from "./popover.module.css";

interface Props {
  systemValues: {
    h: number;
    s: number;
    l: number;
  };
  swatchColor: string;
  setSwatchColor: Dispatch<SetStateAction<string>>;
  width?: number;
}

function HSLPopover({
  systemValues,
  swatchColor,
  setSwatchColor,
  width,
}: Props) {
  const formRef = useFormContext();
  const { setHue, setSaturation, setLightness } = useHSLContext();

  function updateCurrentColor(key: "h" | "s" | "l", value: number) {
    const currentHsl = {
      h: systemValues.h,
      s: systemValues.s,
      l: systemValues.l,
    };
    return formatHex({
      ...currentHsl,
      mode: "hsl",
      [key]: value,
    });
  }

  return (
    <DialogTrigger>
      <Button
        className={s.swatch}
        style={{ backgroundColor: swatchColor }}
        aria-label="Open HSL controls"
      />
      <Popover
        className={s.popover}
        style={{ width: width ?? "auto" }}
        placement="bottom start"
        offset={12}
      >
        <Dialog className={s.dialog}>
          <RangeSlider
            key={`modal-hue-${systemValues.h}`}
            variant="hue"
            name="hue"
            label="Hue"
            defaultValue={systemValues.h}
            min={0}
            max={360}
            step={0.01}
            onChange={(value) => {
              setHue(value);
              setSwatchColor(updateCurrentColor("h", value));
            }}
            onChangeEnd={(value) => {
              formRef.current?.requestSubmit();
              setSwatchColor(updateCurrentColor("h", value));
            }}
            formRef={formRef}
          />
          <RangeSlider
            key={`modal-saturation-${systemValues.s}`}
            variant="saturation"
            name="saturation"
            label="Saturation"
            defaultValue={systemValues.s}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => {
              setSaturation(value);
              setSwatchColor(updateCurrentColor("s", value));
            }}
            onChangeEnd={(value) => {
              formRef.current?.requestSubmit();
              setSwatchColor(updateCurrentColor("s", value));
            }}
            formRef={formRef}
          />
          <RangeSlider
            key={`modal-lightness-${systemValues.l}`}
            variant="lightness"
            name="lightness"
            label="Lightness"
            defaultValue={systemValues.l}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => {
              setLightness(value);
              setSwatchColor(updateCurrentColor("l", value));
            }}
            onChangeEnd={(value) => {
              formRef.current?.requestSubmit();
              setSwatchColor(updateCurrentColor("l", value));
            }}
            formRef={formRef}
          />
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

export default HSLPopover;
