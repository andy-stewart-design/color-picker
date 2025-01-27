import type { ColorFormValues } from "@/App";
import { createContext, ReactNode, useActionState, useContext } from "react";
import { colorReducer, ColorAction } from "./action";
import { DEFAULT_VALUES } from "@/constants";

interface ColorActionContextProps {
  color?: ColorFormValues;
  colorAction?: (payload: ColorAction) => void;
}

const ColorActionContext = createContext<ColorActionContextProps>({});

function ColorActionProvider({ children }: { children: ReactNode }) {
  const [color, colorAction] = useActionState<ColorFormValues, ColorAction>(
    colorReducer,
    DEFAULT_VALUES
  );

  return (
    <ColorActionContext.Provider value={{ color, colorAction }}>
      {children}
    </ColorActionContext.Provider>
  );
}

function useActionContext() {
  const { color, colorAction } = useContext(ColorActionContext);

  if (!color || !colorAction) {
    throw new Error(
      "color, colorAction cannot be accessed outside of an ColorActionProvider"
    );
  }

  return { color, colorAction };
}

export default ColorActionProvider;
// eslint-disable-next-line react-refresh/only-export-components
export { useActionContext };
