import { Dispatch, SetStateAction } from "react";
import { formatHex } from "culori";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import RangeSlider from "@/components/RangeSlider";
import { useHSLContext } from "@/components/Sidebar/hsl-provider";
import { useActionContext } from "@/components/Providers/ActionProvider";
import { COLOR_MODE } from "@/constants";
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
  const { setHue, setSaturation, setLightness } = useHSLContext();
  const { updateColor } = useActionContext();

  function hslToHex(key: "h" | "s" | "l", value: number) {
    const currentHsl = {
      h: systemValues.h,
      s: systemValues.s,
      l: systemValues.l,
    };
    return formatHex({
      ...currentHsl,
      mode: COLOR_MODE,
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
              setSwatchColor(hslToHex("h", value));
            }}
            onChangeEnd={(value) => {
              updateColor("hue");
              setSwatchColor(hslToHex("h", value));
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
              setSwatchColor(hslToHex("s", value));
            }}
            onChangeEnd={(value) => {
              updateColor("saturation");
              setSwatchColor(hslToHex("s", value));
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
              setSwatchColor(hslToHex("l", value));
            }}
            onChangeEnd={(value) => {
              updateColor("lightness");
              setSwatchColor(hslToHex("l", value));
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
