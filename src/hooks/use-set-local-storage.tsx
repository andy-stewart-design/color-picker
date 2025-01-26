import { useEffect } from "react";

export function useSetLocalStorage(key: string, value: string | number) {
  useEffect(() => {
    const currentValue = localStorage.getItem(key);
    if (currentValue === value) return;
    localStorage.setItem(key, value.toString());
  }, [key, value]);
}
