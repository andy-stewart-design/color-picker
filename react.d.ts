import "react";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }

  function useActionState<State>(
    action: (previousState: State, formData: FormData) => Promise<State>,
    initialState: State,
    permalink?: string
  ): [state: State, formAction: () => void];
}
