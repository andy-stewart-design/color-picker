import { ReactNode } from "react";
import ActiveInputProvider from "./ActiveInput";
import FormProvider from "./FormProvider";
import ColorActionProvider from "./ActionProvider";

function Providers({ children }: { children: ReactNode }) {
  return (
    <FormProvider>
      <ColorActionProvider>
        <ActiveInputProvider>{children}</ActiveInputProvider>
      </ColorActionProvider>
    </FormProvider>
  );
}

export default Providers;
