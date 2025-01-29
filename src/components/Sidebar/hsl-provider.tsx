import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface HSLContextProps {
  hue?: number;
  setHue?: Dispatch<SetStateAction<number>>;
  saturation?: number;
  setSaturation?: Dispatch<SetStateAction<number>>;
  lightness?: number;
  setLightness?: Dispatch<SetStateAction<number>>;
}

const HSLContext = createContext<HSLContextProps>({});

interface HSLProviderProps {
  children: ReactNode;
  defaultValues: {
    h: number;
    s: number;
    l: number;
  };
}

function HSLProvider({ children, defaultValues }: HSLProviderProps) {
  const [previousSystemValue, setPreviousSystemValues] =
    useState(defaultValues);
  const [hue, setHue] = useState(defaultValues.h);
  const [saturation, setSaturation] = useState(defaultValues.s);
  const [lightness, setLightness] = useState(defaultValues.l);

  if (defaultValues !== previousSystemValue) {
    setPreviousSystemValues(defaultValues);
    setHue((currentValue) => {
      return currentValue !== defaultValues.h ? defaultValues.h : currentValue;
    });
    setSaturation((currentValue) => {
      return currentValue !== defaultValues.s ? defaultValues.s : currentValue;
    });
    setLightness((currentValue) => {
      return currentValue !== defaultValues.l ? defaultValues.l : currentValue;
    });
  }

  return (
    <HSLContext.Provider
      value={{
        hue,
        setHue,
        saturation,
        setSaturation,
        lightness,
        setLightness,
      }}
    >
      {children}
    </HSLContext.Provider>
  );
}

function useHSLContext() {
  const { hue, setHue, saturation, setSaturation, lightness, setLightness } =
    useContext(HSLContext);

  if (
    typeof hue !== "number" ||
    !setHue ||
    typeof saturation !== "number" ||
    !setSaturation ||
    typeof lightness !== "number" ||
    !setLightness
  ) {
    throw new Error("HSL state cannot be accessed outside of an HSLProvider");
  }

  return { hue, setHue, saturation, setSaturation, lightness, setLightness };
}

export default HSLProvider;
export { useHSLContext };
