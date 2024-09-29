import "react";

declare module "react" {
  function useActionState<State>(
    action: (previousState: State, formData: FormData) => Promise<State>,
    initialState: State,
    permalink?: string
  ): [state: State, formAction: () => void];
}
