import { useContext } from "react";
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
};

function Slider({ name, label, ...props }: Props) {
  return (
    <SliderGroup
      className={s.slider}
      defaultValue={props.defaultValue}
      minValue={props.min}
      maxValue={props.max}
      step={props.step}
      onChange={props.onChange}
      onChangeEnd={props.onChangeEnd}
    >
      <Label className={s.label}>{label}</Label>
      <SliderNumberField className={s.output} />
      <SliderTrack className={s.track}>
        <SliderThumb name={name} className={s.thumb} />
      </SliderTrack>
    </SliderGroup>
  );
}

function SliderNumberField({ className }: { className?: string }) {
  let state = useContext(SliderStateContext)!;
  let labelProps = useSlottedContext(LabelContext)!;
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

export default Slider;
