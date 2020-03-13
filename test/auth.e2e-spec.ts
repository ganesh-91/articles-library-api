import { HttpStatus } from '@nestjs/common';
import 'dotenv/config';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { LoginDTO, RegisterDTO } from '../src/auth/auth.dto';
import { app, database } from './constants';

beforeAll(async () => {
  await mongoose.connect(database);
  await mongoose.connection.db.dropDatabase();
});

// afterAll(async done => {
//   await mongoose.disconnect(done);
// });

describe('AUTH', () => {
  const user: RegisterDTO = {
    email: 'username',
    password: 'password',
  };

  let userToken: string;
  let sellerToken: string;

  it('should register user', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.email).toEqual('username');
        expect(body.user.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED);
  });

  it('should reject duplicate registration', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.message).toEqual('User already exists');
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should login user', () => {
    return request(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        userToken = body.token;

        expect(body.token).toBeDefined();
        expect(body.user.email).toEqual('username');
        expect(body.user.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED);
  });

});
