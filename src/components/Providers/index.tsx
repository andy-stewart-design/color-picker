import { ReactNode } from "react";
import ActiveInputProvider from "./ActiveInput";
import FormProvider from "./FormProvider";

function Providers({ children }: { children: ReactNode }) {
  return (
    <FormProvider>
      <ActiveInputProvider>{children}</ActiveInputProvider>
    </FormProvider>
  );
}

export default Providers;
