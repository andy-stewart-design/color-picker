import { useId } from "react";

export function useIds(amount: number) {
  return Array.from({ length: amount }, () => useId());
}
