import type { ColorFormValues } from "@/App";
import {
  createContext,
  ReactNode,
  startTransition,
  useActionState,
  useContext,
} from "react";
import { colorReducer, type ColorAction, type ColorActionType } from "./action";
import { DEFAULT_VALUES } from "@/constants";
import { useFormContext } from "../FormProvider";

interface ColorActionContextProps {
  color?: ColorFormValues;
  updateColor?: (type: ColorActionType) => void;
}

const ColorActionContext = createContext<ColorActionContextProps>({});

function ColorActionProvider({ children }: { children: ReactNode }) {
  const formRef = useFormContext();
  const [color, colorAction] = useActionState<ColorFormValues, ColorAction>(
    colorReducer,
    DEFAULT_VALUES
  );

  function updateColor(type: ColorActionType) {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startTransition(() => {
      colorAction({ type, data: formData });
    });
  }

  return (
    <ColorActionContext.Provider value={{ color, updateColor }}>
      {children}
    </ColorActionContext.Provider>
  );
}

function useActionContext() {
  const { color, updateColor } = useContext(ColorActionContext);

  if (!color || !updateColor) {
    throw new Error(
      "color, updateColor cannot be accessed outside of an ColorActionProvider"
    );
  }

  return { color, updateColor };
}

export default ColorActionProvider;
// eslint-disable-next-line react-refresh/only-export-components
export { useActionContext };
