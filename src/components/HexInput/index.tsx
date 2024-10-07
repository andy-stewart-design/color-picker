import { type KeyboardEvent, type ChangeEvent, type RefObject } from "react";
import s from "./style.module.css";
import { useActiveInputContext } from "../Providers/ActiveInput";

interface Props {
  name: string;
  defaultValue: string;
  swatchColor: string;
  formRef: RefObject<HTMLFormElement | null>;
}

function HexInput(props: Props) {
  const activeInput = useActiveInputContext();

  return (
    <div className={s.wrapper}>
      <input
        className={s.input}
        name={props.name}
        onChange={handleHexChange}
        onKeyDown={(e) => handleKeyDown(e, props.formRef.current, activeInput)}
        defaultValue={props.defaultValue}
        spellCheck={false}
        autoFocus={activeInput.current === "hex" ? true : undefined}
      />
      <span
        className={s.swatch}
        style={{ backgroundColor: props.swatchColor }}
      ></span>
      <span className={s.hex} style={{ opacity: 0.4 }}>
        #
      </span>
    </div>
  );
}

function handleHexChange(e: ChangeEvent<HTMLInputElement>) {
  let value = e.target.value.toLocaleLowerCase();
  value = value.replace(/[^0-9A-Fa-f]/g, "");
  value = value.slice(0, 6);
  e.target.value = value;
}

function handleKeyDown(
  e: KeyboardEvent<HTMLInputElement>,
  form: HTMLFormElement | null,
  activeInput: RefObject<string | null>
) {
  if (e.key !== "Enter") return;
  const input = e.target;
  if (!(input instanceof HTMLInputElement)) return;

  e.preventDefault();
  const nextValue = validateHexValue(input.value);

  if (nextValue) {
    input.value = nextValue;
    activeInput.current = "hex";
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
