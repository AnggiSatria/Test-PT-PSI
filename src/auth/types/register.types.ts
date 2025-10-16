export interface requestBodyRegister {
  name: string;
  email: string;
  password: string;
  telp: string;
  token: string;
  points: number;
}

export interface requestBodyLogin {
  email: string;
  password: string;
}
