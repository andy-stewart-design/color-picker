/* eslint-disable no-case-declarations */
import { formatHex } from "culori";
import { hsl } from "@/utils/culori";
import { isOfType } from "@/utils/type-guard";
import type { ColorFormValues } from "@/App";

type ColorActionType =
  | "hex"
  | "hue"
  | "saturation"
  | "lightness"
  | "keyIndex"
  | "numColors"
  | (string & {});

interface ColorAction {
  type: ColorActionType;
  data: FormData;
}

function colorReducer(state: ColorFormValues, action: ColorAction) {
  const data = validateFormData(action.data, state);

  switch (action.type) {
    case "hex":
      const nextHsl = hsl(`#${data.hex}`);
      return {
        hex: data.hex,
        h: nextHsl.h,
        s: nextHsl.s,
        l: nextHsl.l,
        numColors: data.numColors,
        keyIndex: -1,
      };
    case "hue":
    case "saturation":
    case "lightness":
      const nextH = action.type === "hue" ? data.h : state.h;
      const nextS = action.type === "saturation" ? data.s : state.s;
      const nextL = action.type === "lightness" ? data.l : state.l;

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
        numColors: data.numColors,
        keyIndex: -1,
      };
    case "keyIndex":
      return data;
    case "numColors":
      return data;
    default:
      throw new Error(`${action.type} is not a valid action type`);
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

export { colorReducer, type ColorAction, type ColorActionType };
