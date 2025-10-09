export type SelectOption<Value> = {
    label: string;
    value: Value;
}

export type SelectOptions<Value> = Array<SelectOption<Value>>;
