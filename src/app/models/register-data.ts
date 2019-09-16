
export interface AccessData {
  email: string;
  name: string;
  cpf: string;
  password: string;
  phone: string;
  cellphone: string;
}

export interface RequestData {
  personal: Personal;
  address: Address;
  fidelities: FidelitiesData;
  bank: Bank;
}

export type FidelitiesNumbers = {
  card_number_JJ: string
  access_password_JJ: string
  type_JJ: string
  card_number_G3: string
  access_password_G3: string
  type_G3: string
  card_number_AD: string
  access_password_AD: string
  card_number_AV: string
  access_password_AV: string
};
export type FidelitiesData = fidelityObject[];
type fidelityObject = {
  access_password: string,
  card_number: string,
  program_id: number,
  type: string
};
export type Personal = {
  birthday: string,
  gender: string,
  phone: string,
  cellphone: string,
  occupation: string,
  provider_occupation_id: number,
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
