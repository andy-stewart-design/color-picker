import {
  Dispatch,
  RefObject,
  SetStateAction,
  startTransition,
  useRef,
  useState,
} from "react";
import { formatHex } from "culori";
import HexInput from "@/components/HexInput";
import RangeSlider from "@/components/RangeSlider";
import NumberInput from "@/components/NumberInput";
import type { ColorFormValues } from "@/App";
import s from "./style.module.css";

import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import HSLProvider, { useHSLTemporaryStateContext } from "./hsl-provider";
import { roundTo } from "@/utils/math";

interface Props {
  action: (payload: FormData) => void;
  formState: ColorFormValues;
}

function ColorForm({ formState, action }: Props) {
  // const [hue, setHue] = useState(formState.h);
  // const [saturation, setSaturation] = useState(formState.s);
  // const [lightness, setLightness] = useState(formState.l);
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

  // function updateCurrentColor(key: "h" | "s" | "l", value: number) {
  //   const currentHsl = {
  //     h: formState.h,
  //     s: formState.s,
  //     l: formState.l,
  //   };
  //   return formatHex({
  //     ...currentHsl,
  //     mode: "hsl",
  //     [key]: value,
  //   });
  // }

  return (
    <HSLProvider key={formState.h} defaultValues={{ hue: formState.h }}>
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
        <HexInput
          key={`hidden-${formState.hex}`}
          name="hex"
          defaultValue={formState.hex}
          swatchColor={swatchColor}
          formRef={formRef}
        />
        <HiddenHSLInputs formState={formState} />
        {/* <input
          key={`hidden-hue-${formState.h}`}
          name="hue"
          type="range"
          onChange={() => {}}
          value={hue}
          min={0}
          max={360}
          step={0.01}
        />
        <input
          key={`hidden-saturation-${formState.s}`}
          name="saturation"
          type="range"
          onChange={() => {}}
          value={saturation}
          min={0}
          max={1}
          step={0.01}
        />
        <input
          key={`hidden-lightness-${formState.l}`}
          name="lightness"
          type="range"
          onChange={() => {}}
          value={lightness}
          min={0}
          max={1}
          step={0.01}
        /> */}

        {/* ------------ */}
        {/* ------------ */}
        {/* ------------ */}

        {/* <RangeSlider
        key={`modal-hue-${formState.h}`}
        variant="hue"
        name="hue"
        label="Hue"
        defaultValue={formState.h}
        min={0}
        max={360}
        step={0.01}
        onChange={(value) => {
          setSwatchColor(updateCurrentColor("h", value));
        }}
        onChangeEnd={(value) => {
          formRef.current?.requestSubmit();
          setSwatchColor(updateCurrentColor("h", value));
        }}
        formRef={formRef}
      />
      <RangeSlider
        key={`modal-saturation-${formState.s}`}
        variant="saturation"
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
        key={`modal-lightness-${formState.l}`}
        variant="lightness"
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
      /> */}

        {/* ------------ */}
        {/* ------------ */}
        {/* ------------ */}

        <HSLPopover
          formRef={formRef}
          formState={formState}
          setSwatchColor={setSwatchColor}
        />

        {/* <DialogTrigger>
          <Button>Settings</Button>
          <Popover>
            <Dialog>
              <div className="flex-col">
                <RangeSlider
                  key={`modal-hue-${formState.h}`}
                  variant="hue"
                  name="hue"
                  label="Hue"
                  defaultValue={formState.h}
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
                  key={`modal-saturation-${formState.s}`}
                  variant="saturation"
                  name="saturation"
                  label="Saturation"
                  defaultValue={formState.s}
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
                  key={`modal-lightness-${formState.l}`}
                  variant="lightness"
                  name="lightness"
                  label="Lightness"
                  defaultValue={formState.l}
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
              </div>
            </Dialog>
          </Popover>
        </DialogTrigger> */}
      </form>
    </HSLProvider>
  );
}

export default ColorForm;

// --------
// --------
// --------

function HiddenHSLInputs({ formState }: { formState: ColorFormValues }) {
  const { hue } = useHSLTemporaryStateContext();
  const saturation = roundTo(0.8431372549019608, 2);
  const lightness = roundTo(0.6, 2);

  return (
    <>
      <input
        key={`hidden-hue-${formState.h}`}
        name="hue"
        type="range"
        onChange={() => {}}
        value={hue}
        min={0}
        max={360}
        step={0.01}
      />
      <input
        key={`hidden-saturation-${formState.s}`}
        name="saturation"
        type="range"
        onChange={() => {}}
        value={saturation}
        min={0}
        max={1}
        step={0.01}
      />
      <input
        key={`hidden-lightness-${formState.l}`}
        name="lightness"
        type="range"
        onChange={() => {}}
        value={lightness}
        min={0}
        max={1}
        step={0.01}
      />
    </>
  );
}

function HSLPopover({
  formState,
  formRef,
  setSwatchColor,
}: {
  formState: ColorFormValues;
  formRef: RefObject<HTMLFormElement | null>;
  setSwatchColor: Dispatch<SetStateAction<string>>;
}) {
  // const { setHue } = useHSLTemporaryStateContext();
  // function setHue(v: number) {
  //   console.log(v);
  // }
  function setSaturation(v: number) {
    console.log(v);
  }
  function setLightness(v: number) {
    console.log(v);
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
    <DialogTrigger>
      <Button>Settings</Button>
      <Popover>
        <Dialog>
          <div className="flex-col">
            <HueSlider
              formRef={formRef}
              formState={formState}
              setSwatchColor={setSwatchColor}
            />
            <RangeSlider
              key={`modal-saturation-${formState.s}`}
              variant="saturation"
              name="saturation"
              label="Saturation"
              defaultValue={formState.s}
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
              key={`modal-lightness-${formState.l}`}
              variant="lightness"
              name="lightness"
              label="Lightness"
              defaultValue={formState.l}
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
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}

function HueSlider({
  formState,
  formRef,
  setSwatchColor,
}: {
  formState: ColorFormValues;
  formRef: RefObject<HTMLFormElement | null>;
  setSwatchColor: Dispatch<SetStateAction<string>>;
}) {
  const { setHue } = useHSLTemporaryStateContext();

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
    <RangeSlider
      key={`modal-hue-${formState.h}`}
      variant="hue"
      name="hue"
      label="Hue"
      defaultValue={formState.h}
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
  );
}
