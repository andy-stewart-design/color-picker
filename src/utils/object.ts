export function compareObjects<T extends object>(prev: T, next: T): Partial<T> {
  const changes: Partial<T> = {};

  (Object.keys(next) as Array<keyof T>).forEach((key) => {
    if (next[key] !== prev[key]) {
      changes[key] = next[key];
    }
  });

  return changes;
}
