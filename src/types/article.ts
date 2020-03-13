import { Document } from 'mongoose';

import { User } from './user';

export interface Article extends Document {
  url: string;
  author: User;
  title: string;
  image: string;
  description: string;
  created: Date;
  rating: Number;
}
