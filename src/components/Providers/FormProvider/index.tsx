import {
  createContext,
  ReactNode,
  useContext,
  useRef,
  type RefObject,
} from "react";

interface FormContextProps {
  formRef?: RefObject<HTMLFormElement | null>;
}

const FormContext = createContext<FormContextProps>({});

function FormProvider({ children }: { children: ReactNode }) {
  const formRef = useRef(null);

  return (
    <FormContext.Provider value={{ formRef }}>{children}</FormContext.Provider>
  );
}

function useFormContext() {
  const { formRef } = useContext(FormContext);

  if (!formRef) {
    throw new Error(
      "formRef ref cannot be accessed outside of an FormProvider"
    );
  }

  return formRef;
}

export default FormProvider;
export { useFormContext };
