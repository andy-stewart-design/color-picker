import { useActiveInputContext } from "@/components/Providers/ActiveInput";
import type {
  KeyboardEvent,
  ChangeEvent,
  RefObject,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import s from "./style.module.css";

interface HexInputWrapperProps {
  children: ReactNode;
}

interface HexInputProps {
  name: string;
  defaultValue: string;
  formRef: RefObject<HTMLFormElement | null>;
  setSwatchColor: Dispatch<SetStateAction<string>>;
}

function HexInputWrapper({ children }: HexInputWrapperProps) {
  return (
    <div className={s.wrapper}>
      {children}
      <span className={s.hex} style={{ opacity: 0.4 }}>
        #
      </span>
    </div>
  );
}

function HexInput({
  name,
  formRef,
  defaultValue,
  setSwatchColor,
}: HexInputProps) {
  const activeInput = useActiveInputContext();

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const input = e.target;
    if (!(input instanceof HTMLInputElement)) return;

    e.preventDefault();
    const nextValue = validateHexValue(input.value);

    if (nextValue) {
      input.value = nextValue;
      activeInput.current = "hex";
      setSwatchColor(`#${nextValue}`);
      formRef.current?.requestSubmit();
    }
  }

  return (
    <input
      className={s.input}
      name={name}
      onChange={handleHexChange}
      onKeyDown={handleKeyDown}
      defaultValue={defaultValue}
      spellCheck={false}
      autoFocus={activeInput.current === "hex" ? true : undefined}
    />
  );
}

function handleHexChange(e: ChangeEvent<HTMLInputElement>) {
  let value = e.target.value.toLocaleLowerCase();
  value = value.replace(/[^0-9A-Fa-f]/g, "");
  value = value.slice(0, 6);
  e.target.value = value;
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
export { HexInput, HexInputWrapper };
