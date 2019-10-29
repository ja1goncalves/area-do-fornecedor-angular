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