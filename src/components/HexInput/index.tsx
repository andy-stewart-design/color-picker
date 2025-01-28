import { useActiveInputContext } from "@/components/Providers/ActiveInput";
import HSLPopover from "@/components/Sidebar/hsl-popover";
import type {
  KeyboardEvent,
  ChangeEvent,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import type { ColorFormValues } from "@/App";
import s from "./style.module.css";
import { useMeasure } from "@/hooks/use-measure";
import { useActionContext } from "../Providers/ActionProvider";

// ------------------------------------------------
// DEFAULT EXPORT: KEY COLOR INPUT
// ------------------------------------------------

interface KeyColorInputProps {
  systemValues: ColorFormValues;
  swatchColor: string;
  setSwatchColor: Dispatch<SetStateAction<string>>;
}

function KeyColorInput({
  systemValues,
  swatchColor,
  setSwatchColor,
}: KeyColorInputProps) {
  const [inputRect, inputRef] = useMeasure<HTMLDivElement>();

  return (
    <div className={s.componentWrapper}>
      <label htmlFor="hex-input">Key Color</label>
      <HexInputWrapper>
        <HSLPopover
          systemValues={systemValues}
          swatchColor={swatchColor}
          setSwatchColor={setSwatchColor}
          width={inputRect?.width}
        />
        <div ref={inputRef} style={{ display: "grid", flex: "1 0 0" }}>
          <HexInput
            key={`hidden-${systemValues.hex}`}
            name="hex"
            id="hex-input"
            defaultValue={systemValues.hex}
            setSwatchColor={setSwatchColor}
          />
        </div>
      </HexInputWrapper>
    </div>
  );
}

// ------------------------------------------------
// HEX INPUT WRAPPER
// ------------------------------------------------

interface HexInputWrapperProps {
  children: ReactNode;
}

function HexInputWrapper({ children }: HexInputWrapperProps) {
  return (
    <div className={s.inputWrapper}>
      {children}
      <span className={s.hex} style={{ opacity: 0.4 }}>
        #
      </span>
    </div>
  );
}

// ------------------------------------------------
// HEX INPUT
// ------------------------------------------------

interface HexInputProps {
  id: string;
  name: string;
  defaultValue: string;
  setSwatchColor: Dispatch<SetStateAction<string>>;
}

function HexInput({ id, name, defaultValue, setSwatchColor }: HexInputProps) {
  const activeInput = useActiveInputContext();
  const { updateColor } = useActionContext();

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

      updateColor("hex");
    }
  }

  return (
    <>
      <input
        id={id}
        className={s.input}
        name={name}
        onChange={handleHexChange}
        onKeyDown={handleKeyDown}
        defaultValue={defaultValue}
        spellCheck={false}
        autoFocus={activeInput.current === "hex" ? true : undefined}
      />
    </>
  );
}

// ------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------

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

export default KeyColorInput;
export { HexInput, HexInputWrapper };
