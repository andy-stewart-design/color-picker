import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  type ReactNode,
} from "react";
import { DEFAULT_VALUES } from "@/constants";
import { useFormContext } from "@/components/Providers/FormProvider";
import { colorReducer, type ColorAction, type ColorActionType } from "./action";
import type { ColorFormData } from "@/types";

interface ColorActionContextProps {
  formData?: ColorFormData;
  updateColor?: (type: ColorActionType) => void;
}

const ActionContext = createContext<ColorActionContextProps>({});

function ActionProvider({ children }: { children: ReactNode }) {
  const formRef = useFormContext();

  const [formData, colorAction] = useActionState<ColorFormData, ColorAction>(
    colorReducer,
    DEFAULT_VALUES
  );

  function updateColor(type: ColorActionType) {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    startTransition(() => {
      colorAction({ type, data });
    });
  }

  return (
    <ActionContext.Provider value={{ formData, updateColor }}>
      {children}
    </ActionContext.Provider>
  );
}

function useActionContext() {
  const { formData, updateColor } = useContext(ActionContext);

  if (!formData || !updateColor) {
    throw new Error(
      "ActionContext values cannot be accessed outside of an ColorActionProvider"
    );
  }

  return { formData, updateColor };
}

export default ActionProvider;
// eslint-disable-next-line react-refresh/only-export-components
export { useActionContext };
