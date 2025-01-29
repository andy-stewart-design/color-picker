import {
  Button,
  Group,
  Input,
  Label,
  NumberField,
} from "react-aria-components";
import clsx from "clsx";
import { useActiveInputContext } from "@/components/Providers/ActiveInput";
import type {
  ComponentPropsWithoutRef,
  FocusEvent,
  KeyboardEvent,
  ReactNode,
} from "react";
import s from "./style.module.css";

type NumberFieldProps = ComponentPropsWithoutRef<typeof NumberField>;

interface Props {
  name: string;
  label?: string;
  children?: ReactNode;
  defaultValue: NumberFieldProps["defaultValue"];
  min: NumberFieldProps["minValue"];
  max: NumberFieldProps["maxValue"];
  onSubmit?: () => void;
}

function NumberInput({
  name,
  defaultValue,
  label,
  onSubmit,
  children,
  min,
  max,
}: Props) {
  const activeInput = useActiveInputContext();

  function handleKeyUp(e: KeyboardEvent<Element>) {
    const target = e.target;
    if (e.key !== "Enter" || !(target instanceof HTMLInputElement)) return;

    const { value } = target;
    if (Number(value) !== defaultValue) {
      requestSubmit();
    }
  }

  function handleBlur(e: FocusEvent<Element>) {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;

    activeInput.current = null;
    const { value } = target;
    if (Number(value) !== defaultValue) {
      requestSubmit();
    }
  }

  function requestSubmit() {
    onSubmit?.();
    activeInput.current = name;
  }

  return (
    <NumberField
      className={s.label}
      name={name}
      defaultValue={defaultValue}
      minValue={min}
      maxValue={max}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      autoFocus={activeInput.current === name ? true : undefined}
    >
      <Label>{children ?? label}</Label>
      <Group className={s.group}>
        <Button
          className={clsx(s.button, s.dec)}
          slot="decrement"
          onPressEnd={requestSubmit}
        >
          -
        </Button>
        <Input className={s.input} />
        <Button
          className={clsx(s.button, s.inc)}
          slot="increment"
          onPressEnd={requestSubmit}
        >
          +
        </Button>
      </Group>
    </NumberField>
  );
}

export default NumberInput;
