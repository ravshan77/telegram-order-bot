export type Nullable<T extends object | object[]> = T extends object[]
    ? Array<NullableFields<T[0]>>
    : NullableFields<T>

type NullableFields<T> =  {
    [P in keyof T]: T[P] extends object[]
        ? Nullable<NonNullable<T[P]>> | null
        : T[P] extends object | null
            ? NullableFields<NonNullable<T[P]>> | null
            : NonNullable<T[P]> | null
};

