import { ReactNode } from "react";
import ActiveInputProvider from "./ActiveInput";
import FormProvider from "./FormProvider";
import ActionProvider from "./ActionProvider";
import ColorProvider from "./ColorProvider";

function Providers({ children }: { children: ReactNode }) {
  return (
    <FormProvider>
      <ActionProvider>
        <ColorProvider>
          <ActiveInputProvider>{children}</ActiveInputProvider>
        </ColorProvider>
      </ActionProvider>
    </FormProvider>
  );
}

export default Providers;
