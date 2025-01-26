// @ts-expect-error need to update react type definitions?
import { useActionState } from "react";
import { formatHex } from "culori";
import { hsl } from "@/utils/culori";
import { compareObjects } from "@/utils/object";
import { DEFAULT_VALUES } from "@/constants";
import { isOfType } from "@/utils/type-guard";
import type { ColorFormValues } from "@/App";

function useColorFormAction() {
  const [formValue, formAction] = useActionState<ColorFormValues, FormData>(
    handleSubmit,
    DEFAULT_VALUES
  );

  return [formValue, formAction] as const;
}

function handleSubmit(previousState: ColorFormValues, formData: FormData) {
  const nextState = validateFormData(formData, previousState);
  const changedValues = compareObjects(previousState, nextState);

  if (Object.keys(changedValues).length === 0) {
    return previousState;
  } else if (
    Object.keys(changedValues).length === 1 &&
    "keyIndex" in changedValues
  ) {
    return nextState;
  } else if ("numColors" in changedValues) {
    return nextState;
  } else if ("hex" in changedValues) {
    const nextHsl = hsl(`#${nextState.hex}`);
    return {
      hex: nextState.hex,
      h: nextHsl.h,
      s: nextHsl.s,
      l: nextHsl.l,
      numColors: nextState.numColors,
      keyIndex: -1,
    };
  } else {
    const nextH = "h" in changedValues ? nextState.h : previousState.h;
    const nextS = "s" in changedValues ? nextState.s : previousState.s;
    const nextL = "l" in changedValues ? nextState.l : previousState.l;

    const nextHex = formatHex({
      mode: "hsl",
      h: nextH,
      s: nextS,
      l: nextL,
    });

    return {
      h: nextH,
      s: nextS,
      l: nextL,
      hex: nextHex.replace("#", ""),
      numColors: nextState.numColors,
      keyIndex: -1,
    };
  }
}

function validateFormData(
  formData: FormData,
  previousState: ColorFormValues
): ColorFormValues {
  const hex = formData.get("hex");
  const hue = formData.get("hue");
  const saturation = formData.get("saturation");
  const lightness = formData.get("lightness");
  const numColors = formData.get("numColors");
  const keyIndex = formData.get("keyIndex");

  return {
    hex: isOfType("string", hex) ? hex : previousState.hex,
    h: isOfType("string", hue) ? Number(hue) : previousState.h,
    s: isOfType("string", saturation) ? Number(saturation) : previousState.s,
    l: isOfType("string", lightness) ? Number(lightness) : previousState.l,
    numColors: isOfType("string", numColors)
      ? Number(numColors)
      : previousState.numColors,
    keyIndex: isOfType("string", keyIndex)
      ? Number(keyIndex)
      : previousState.keyIndex,
  };
}
export { useColorFormAction };
