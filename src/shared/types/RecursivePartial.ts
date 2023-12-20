export type RecursivePartial<T extends {}> = 
    T extends (...args: any[]) => any 
    ? T // keep function types intact
    : {
        [K in keyof T]?: 
            T[K] extends (infer A extends {})[]
                ? RecursivePartial<A>[]
                : T[K] extends {}
                    ? RecursivePartial<T[K]>
                    : T[K];
    };