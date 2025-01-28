import {
  useContext,
  type KeyboardEvent,
  CSSProperties,
  ReactNode,
} from "react";
import {
  Label,
  Slider as SliderGroup,
  SliderThumb,
  SliderTrack,
  Input,
  LabelContext,
  NumberField,
  SliderStateContext,
  useSlottedContext,
} from "react-aria-components";
import { useActiveInputContext } from "@/components/Providers/ActiveInput";
import { useActionContext } from "@/components/Providers/ActionProvider";
import s from "./style.module.css";

type Props = {
  variant?: "default" | "hue" | "saturation" | "lightness";
  name: string;
  label: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  onChangeEnd: (value: number) => void;
  onKeyUp: (e: KeyboardEvent<Element>) => void;
};

function Slider({ variant, name, label, onKeyUp, ...props }: Props) {
  const activeInput = useActiveInputContext();

  function handleChange(value: number) {
    activeInput.current = name;
    props.onChange(value);
  }

  function handleKeyUp(e: KeyboardEvent<Element>) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      activeInput.current = name;
      onKeyUp(e);
    }
  }

  function handleChangeEnd(value: number) {
    props.onChangeEnd?.(value);
  }

  return (
    <SliderGroup
      className={s.slider}
      defaultValue={props.defaultValue}
      minValue={props.min}
      maxValue={props.max}
      step={props.step}
      onChange={handleChange}
      onChangeEnd={handleChangeEnd}
      data-variant={variant ?? "default"}
      style={
        {
          "--progress": `${(props.defaultValue / props.max) * 100}%`,
        } as CSSProperties
      }
    >
      <div className={s.topRow}>
        <Label className={s.label}>{label}</Label>
        <SliderNumberField
          name={name}
          min={props.min}
          max={props.max}
          step={props.step}
        />
      </div>
      <div className={s.trackWrapper}>
        <StyledSliderTrack>
          <SliderThumb
            name={name}
            className={s.thumb}
            onKeyUp={handleKeyUp}
            autoFocus={activeInput.current === name ? true : undefined}
          />
        </StyledSliderTrack>
      </div>
    </SliderGroup>
  );
}

function SliderNumberField({
  name,
  min,
  max,
  step,
}: {
  name: string;
  min: number;
  max: number;
  step: number;
}) {
  const state = useContext(SliderStateContext);
  const labelProps = useSlottedContext(LabelContext);
  const { updateColor } = useActionContext();

  if (!labelProps) return null;

  return (
    <NumberField
      className={s.output}
      aria-labelledby={labelProps.id}
      value={state?.values[0]}
      minValue={min}
      maxValue={max}
      step={step}
      onKeyDown={(e) => {
        const target = e.target;
        if (!(target instanceof HTMLInputElement)) return;
        if (e.key === "Enter") state?.setThumbValue(0, Number(target.value));
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          updateColor(name);
        }
      }}
    >
      <Input />
    </NumberField>
  );
}

function StyledSliderTrack({ children }: { children: ReactNode }) {
  const state = useContext(SliderStateContext);
  if (!state) return null;

  return (
    <SliderTrack
      className={s.track}
      style={
        {
          "--progress": `${
            (state?.getThumbValue(0) / state?.getThumbMaxValue(0)) * 100
          }%`,
        } as CSSProperties
      }
    >
      {children}
    </SliderTrack>
  );
}

export default Slider;
