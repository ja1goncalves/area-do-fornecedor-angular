

export interface AccessData {
  email: string,
  name: string,
  cpf: string,
  password: string,
};

export interface RequestData {
  personal: Personal,
  address: Address,
  fidelities: null,
  bank: Bank
};

export type Personal = {
  birthday: string,
  gender: string,
  phone: string,
  cellphone: string,
  occupation: string,
  provider_ocuppation_id: number,
  company: string,
  company_phone: string
};
export type Address = {
  zip_code: string,
  address: string,
  number: string,
  complement: string,
  neighborhood: string,
  city: string,
  state: string
};
export type Bank = {
  bank_id: string,
  type: string,
  segment_id: string,
  agency: string,
  agency_digit: string,
  account: string,
  account_digit: string,
  operation: number
};
