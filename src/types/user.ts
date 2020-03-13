import { Document } from 'mongoose';

export interface Address {
  addr1: string;
  addr2: string;
  city: string;
  state: string;
  country: string;
  zip: number;
}

export interface User extends Document {
  user_name: string;
  readonly password: string;
  address: Address;
  created: Date;
  nickname:string;
  email:string;
  image: string;
}
