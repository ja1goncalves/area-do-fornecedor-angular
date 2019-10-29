import { FidelitiesNumbers, IBankWithId, IAddressWithId, Personal} from 'src/app/models/register-data';


export interface IFidelity {
    id: string | number;
    program_id: string | number;
    card_number: string | number;
    access_password: string;
}

export interface IRequestData {
    address: IAddressWithId;
    bank: IBankWithId;
    personal: Personal;
    fidelities: FidelitiesNumbers;
}