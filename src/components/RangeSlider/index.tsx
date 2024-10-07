import {
  useContext,
  type RefObject,
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
import s from "./style.module.css";

type Props = {
  name: string;
  label: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  onChangeEnd: (value: number) => void;
  formRef: RefObject<HTMLFormElement | null>;
};

function Slider({ name, label, formRef, ...props }: Props) {
  const activeInput = useActiveInputContext();

  function handleChange(value: number) {
    activeInput.current = name;
    props.onChange(value);
  }

  function handleKeyUp(e: KeyboardEvent<Element>) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      activeInput.current = name;
      formRef.current?.requestSubmit();
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
      style={
        {
          "--progress": `${(props.defaultValue / props.max) * 100}%`,
        } as CSSProperties
      }
    >
      <div className={s.topRow}>
        <Label className={s.label}>{label}</Label>
        <SliderNumberField className={s.output} />
      </div>
      <StyledSliderTrack>
        <SliderThumb
          name={name}
          className={s.thumb}
          onKeyUp={handleKeyUp}
          autoFocus={activeInput.current === name ? true : undefined}
        />
      </StyledSliderTrack>
    </SliderGroup>
  );
}

function SliderNumberField({ className }: { className?: string }) {
  const state = useContext(SliderStateContext);
  const labelProps = useSlottedContext(LabelContext);

  if (!labelProps) return null;

  return (
    <NumberField
      className={className}
      aria-labelledby={labelProps.id}
      value={state.values[0]}
      onChange={(v) => state.setThumbValue(0, v)}
    >
      <Input />
    </NumberField>
  );
}

function StyledSliderTrack({ children }: { children: ReactNode }) {
  const state = useContext(SliderStateContext);

  return (
    <SliderTrack
      className={s.track}
      style={
        {
          "--progress": `${
            (state.getThumbValue(0) / state.getThumbMaxValue(0)) * 100
          }%`,
        } as CSSProperties
      }
    >
      {children}
    </SliderTrack>
  );
}

export default Slider;
