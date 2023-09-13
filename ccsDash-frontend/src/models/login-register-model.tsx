export interface LoginRegister {
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    password: string;
    IpAddress: string;
}

export const loginRegisterEmptyObj = {
    first_name: '',
    last_name: '',
    role: '',
    email: '',
    password: '',
    IpAddress: ''
}