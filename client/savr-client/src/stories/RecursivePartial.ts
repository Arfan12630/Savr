export type RecursivePartial<T = object> = {
  [P in keyof T]?: T[P] extends (infer I)[]
    ? RecursivePartial<I>[]
    : T[P] extends Record<string, any>
    ? RecursivePartial<T[P]>
    : T[P];
};
