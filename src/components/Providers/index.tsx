import { ReactNode } from "react";
import ActiveInputProvider from "./ActiveInput";

function Providers({ children }: { children: ReactNode }) {
  return <ActiveInputProvider>{children}</ActiveInputProvider>;
}

export default Providers;
