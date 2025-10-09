export type Optional<T extends object | object[]> = T extends object[]
    ? Array<OptionalFields<T[0]>>
    : OptionalFields<T>

type OptionalFields<T> =  {
    [P in keyof T]?: T[P] extends object[]
        ? OptionalValue<Optional<T[P]>>
        : T[P] extends object
            ? OptionalValue<OptionalFields<T[P]>>
            : OptionalValue<T[P]>
};

type OptionalValue<T> = T | undefined;

