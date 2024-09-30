import { type KeyboardEvent, type ChangeEvent, type RefObject } from "react";
import s from "./style.module.css";

interface Props {
  name: string;
  defaultValue: string;
  swatchColor: string;
  form: RefObject<HTMLFormElement | null>;
}

function HexInput(props: Props) {
  return (
    <div className={s.input}>
      <span
        className={s.swatch}
        style={{ backgroundColor: props.swatchColor }}
      ></span>
      <span style={{ opacity: 0.4 }}>#</span>
      <input
        name={props.name}
        onChange={handleHexChange}
        onKeyDown={(e) => handleKeyDown(e, props.form.current)}
        defaultValue={props.defaultValue}
      />
    </div>
  );
}

function handleHexChange(e: ChangeEvent<HTMLInputElement>) {
  let value = e.target.value.toUpperCase();
  value = value.replace(/[^0-9A-F]/g, "");
  value = value.slice(0, 6);
  e.target.value = value;
}

function handleKeyDown(
  e: KeyboardEvent<HTMLInputElement>,
  form: HTMLFormElement | null
) {
  if (e.key !== "Enter") return;
  const input = e.target;
  if (!(input instanceof HTMLInputElement)) return;

  e.preventDefault();
  const nextValue = validateHexValue(input.value);

  if (nextValue) {
    input.value = nextValue;
    form?.requestSubmit();
  }
}

function validateHexValue(value: string) {
  if (value.length === 1) {
    return `${value}${value}${value}${value}${value}${value}`;
  } else if (value.length === 3) {
    return `${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`;
  } else if (value.length === 6) {
    return value;
  } else return null;
}

export default HexInput;
