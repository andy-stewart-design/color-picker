import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface HSLTemporaryStateProps {
  hue?: number;
  setHue?: Dispatch<SetStateAction<number>>;
}

const HSLTemporaryStateContext = createContext<HSLTemporaryStateProps>({});

interface ProviderProps {
  children: ReactNode;
  defaultValues: {
    hue: number;
  };
}

function HSLProvider({ children, defaultValues }: ProviderProps) {
  const [hue, setHue] = useState(defaultValues.hue);

  return (
    <HSLTemporaryStateContext.Provider value={{ hue, setHue }}>
      {children}
    </HSLTemporaryStateContext.Provider>
  );
}

function useHSLTemporaryStateContext() {
  const { hue, setHue } = useContext(HSLTemporaryStateContext);

  if (!hue || !setHue)
    throw new Error(
      "HSLTemporaryState cannot be accessed outside of an HSLProvider"
    );

  return { hue, setHue };
}

export default HSLProvider;
export { useHSLTemporaryStateContext };
