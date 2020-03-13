import { Address } from '../types/user';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  user_name?: string;
  password: string;
  email: string;
  address?: Address;
  nickname?: string;
}
