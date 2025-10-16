export interface requestHeader {
  id?: string;
  email?: string;
  name?: string;
  telp?: string;
  points?: number;
}

// export interface responseBody {
//   id: string;
//   email?: string;
//   name?: string;
//   telp?: string;
//   points?: number;
//   created_at: Date;
//   updated_at: Date;
//   message: string;
// }

export interface responseBody<T> {
  message: string;
  data: T;
}
