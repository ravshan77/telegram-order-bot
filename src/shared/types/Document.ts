export interface Catalog {
    code: string;
    name: string;
}

export interface DocumentInfo {
    number: string;
    date: string;
}

export interface DocumentMember {
    inn: string;
    name: string;
}

export interface Branch<IsNullable extends "nullable" | never = never> {
    branch_code: IsNullable extends never ? string : string | null;
    branch_name: IsNullable extends never ? string : string | null;
}


export interface RoamingError {
    status: number;
    message: string;
    time: DateTime;
}

export type DateTime = Date

export interface AttorneyPersonInfo {
    position: string;
    full_name: string;
    person_inn: string;
}

export interface PassportInfo {
    number: string;
    issued_by: string;
    date_of_issue: Date;
}

export interface AttorneyInfo {
    number: string;
    start: Date;
    end: Date;
}

export interface CompanyDirectorAccountant {
    director: string;
    accountant: string;
}

export interface BankAccount {
    bank_id: string;
    account: string;
    attribute: number;
    condition: number;
}


export interface HistoryInfo {
    action: number;
    action_date: Date;
    certificate: CertificateInfo;
}

export interface CertificateInfo {
    serial_number: string;
    full_name: string;
    signing_time: Date;
}

export type DocumentItemVatRate = null | 0 | 12;
export type DocumentDateString = string;
