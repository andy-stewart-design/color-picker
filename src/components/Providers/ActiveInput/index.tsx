import {
  createContext,
  ReactNode,
  useContext,
  useRef,
  type RefObject,
} from "react";

interface ActiveInputProps {
  activeInput?: RefObject<string>;
}

const ActiveInputContext = createContext<ActiveInputProps>({});

function ActiveInputProvider({ children }: { children: ReactNode }) {
  const activeInput = useRef("hex");

  return (
    <ActiveInputContext.Provider value={{ activeInput }}>
      {children}
    </ActiveInputContext.Provider>
  );
}

function useActiveInputContext() {
  const { activeInput } = useContext(ActiveInputContext);

  if (!activeInput)
    throw new Error(
      "activeInput ref cannot be accessed outside of an ActiveInputProvider"
    );

  return activeInput;
}

export default ActiveInputProvider;
export { useActiveInputContext };
