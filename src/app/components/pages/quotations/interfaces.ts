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

export interface IQuotation {
    id: number;
    status_orders: null | {
        status: string;
        program: string;
        price: number;
    }[];
    created_at: string;
    updated_at: {
        date: string;
        timezone_type: number;
        timezone: string;
    };
    total: number;
    programs: {
        [key: string]: IPaymentInfo
    } 
}