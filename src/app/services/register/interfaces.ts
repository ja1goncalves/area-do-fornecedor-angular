import { IFidelity } from '../../components/pages/profile/interfaces';

interface IFidelityRes extends IFidelity {
    code: string;
}

export interface IAddressData {
    id: string | number;
    address: string;
    city: string;
    complement: string;
    neighborhood: string;
    number: string | number;
    state: string;
    zip_code: string | number;
}

export interface IPersonalData {
    birthday: string;
    cellphone: string;
    company: string | null;
    company_phone: string | null;
    gender: 'F' | 'M';
    occupation: string | null;
    phone: string | null;
    provider_occupation_id: string | number;
}

export interface IProgramData {
    address: IAddressData | null;
    bank: {
        account: string | number;
        account_digit: string | number;
        agency: string | number;
        agency_digit: string | number;
        bank_id: string | number;
        created: string;
        created_by: string | null;
        deleted: string | null;
        id: number;
        main: number;
        modified: string;
        modified_by: string | null;
        operation: string | null;
        provider_id: number | null;
        segment_id: string;
        type: 'CC' | 'PP';
    } | null;
    fidelities: IFidelityRes[];
    personal: IPersonalData;
}