/* eslint-disable no-case-declarations */
import { formatHex } from "culori";
import { hsl } from "@/utils/culori";
import { isOfType } from "@/utils/type-guard";
import type { ColorFormData } from "@/types";

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

function colorReducer(state: ColorFormData, action: ColorAction) {
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
  previousState: ColorFormData
): ColorFormData {
  const d = Object.fromEntries(formData);

  return {
    hex: isOfType("string", d.hex) ? d.hex : previousState.hex,
    h: isOfType("string", d.hue) ? Number(d.hue) : previousState.h,
    s: isOfType("string", d.saturation)
      ? Number(d.saturation)
      : previousState.s,
    l: isOfType("string", d.lightness) ? Number(d.lightness) : previousState.l,
    numColors: isOfType("string", d.numColors)
      ? Number(d.numColors)
      : previousState.numColors,
    keyIndex: isOfType("string", d.keyIndex)
      ? Number(d.keyIndex)
      : previousState.keyIndex,
  };
}

export { colorReducer, type ColorAction, type ColorActionType };
