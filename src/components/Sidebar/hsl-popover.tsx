import { Dispatch, SetStateAction } from "react";
import { formatHex } from "culori";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import RangeSlider from "@/components/RangeSlider";
import { useHSLContext } from "@/components/Sidebar/hsl-provider";
import s from "./popover.module.css";
import { useActionContext } from "../Providers/ActionProvider";

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
  const { setHue, setSaturation, setLightness } = useHSLContext();
  const { updateColor } = useActionContext();

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
              updateColor("hue");
              setSwatchColor(updateCurrentColor("h", value));
            }}
            onKeyUp={() => {
              updateColor("hue");
            }}
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
              updateColor("saturation");
              setSwatchColor(updateCurrentColor("s", value));
            }}
            onKeyUp={() => {
              updateColor("saturation");
            }}
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
              updateColor("lightness");
              setSwatchColor(updateCurrentColor("l", value));
            }}
            onKeyUp={() => {
              updateColor("lightness");
            }}
          />
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

export default HSLPopover;
