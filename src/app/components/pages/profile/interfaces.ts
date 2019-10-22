import { IAddressData, IPersonalData } from '../../../services/register/interfaces';

export interface IFidelity {
    id: string | number;
    program_id: string | number;
    card_number: string | number;
    access_password: string;
}

export interface IRequestData {
    address: IAddressData;
    bank: {
        id: string | number;
        account: string | number;
        account_digit: string | number;
        agency: string | number;
        agency_digit: string | number;
        bank_id: string | number;
        operation: string;
        segment_id: string;
        type: string;
    };
    personal: IPersonalData;
    fidelities: IFidelity[];
}