

export interface AccessData {
  email: string,
  name: string,
  cpf: string,
  password: string,
};

export interface RequestData {
  personal: Personal,
  address: Address,
  fidelities: Fidelities,
  bank: Bank
};


export type Fidelities = {
  card_number_JJ: string
  access_password_JJ: string
  card_number_G3: string
  card_number_AD: string
  card_number_AV: string
}

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
