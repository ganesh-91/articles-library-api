import { HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as mongoose from 'mongoose';
import { RegisterDTO } from 'src/auth/auth.dto';
import { CreateArticleDTO } from 'src/article/article.dto';
import * as request from 'supertest';
import { app, database } from './constants';

let sellerToken: string;
let productSeller: RegisterDTO = {
  email: 'productSeller',
  password: 'password'
};

beforeAll(async () => {
  await mongoose.connect(database);
  await mongoose.connection.db.dropDatabase();

  const {
    data: { token },
  } = await axios.post(`${app}/auth/register`, productSeller);

  sellerToken = token;
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('PRODUCT', () => {
  const product: CreateArticleDTO = {
    title: 'new phone',
    image: 'n/a',
    description: 'description'
  };

  let productId: string;

  it('should list all products', () => {
    return request(app)
      .get('/article')
      .expect(200);
  });

  it('should list my products', () => {
    return request(app)
      .get('/article/mine')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200);
  });

  it('should create product', () => {
    return request(app)
      .post('/article')
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('Accept', 'application/json')
      .send(product)
      .expect(({ body }) => {
        expect(body._id).toBeDefined();
        productId = body._id;
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.author.email).toEqual(productSeller.email);
      })
      .expect(HttpStatus.CREATED);
  });

  it('should read product', () => {
    return request(app)
      .get(`/article/${productId}`)
      .expect(({ body }) => {
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.author.email).toEqual(productSeller.email);
      })
      .expect(200);
  });

  it('should update product', () => {
    return request(app)
      .put(`/article/${productId}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .set('Accept', 'application/json')
      .send({
        title: 'newTitle',
      })
      .expect(({ body }) => {
        expect(body.title).not.toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.author.email).toEqual(productSeller.email);
      })
      .expect(200);
  });

  it('should delete product', async () => {
    await axios.delete(`${app}/article/${productId}`, {
      headers: { Authorization: `Bearer ${sellerToken}` },
    });

    return request(app)
      .get(`/article/${productId}`)
      .expect(HttpStatus.NO_CONTENT);
  });
});
