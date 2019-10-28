export interface IPaymentReq {
    [key: number]: {
        id: number;
        number: string;
        paymentMethod: number | '';
        price: number | string;
        sellThis: boolean;
        value: number;
        files: any[];
    }
}

export interface IPaymentMethods {
    id: number;
    title: string;
};

export interface IPaymentInfo extends IPaymentMethods {
    [key: string]: {
        id: number;
        value: number;
        price: number;
        payment_form: 'Antecipado' | 'Postecipado';
    } | any
};

export interface IStatus {
    [key: string]: boolean
}