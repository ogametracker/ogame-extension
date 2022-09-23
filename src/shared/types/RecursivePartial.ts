export type RecursivePartial<T extends {}> = {
    [K in keyof T]?: 
        T[K] extends (infer A)[]
            ? RecursivePartial<A>[]
            : T[K] extends {}
                ? RecursivePartial<T[K]>
                : T[K];
    };