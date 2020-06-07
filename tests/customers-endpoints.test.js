const request = require('supertest');
const app = require('../server.js');
const Customer = require('../models/customer.model.js');

describe('customers endpoints', () => {
  describe('GET /customers', () => {
    describe('when there are two customers in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Customer.create({ first_name: 'John', last_name: 'Doe', email: 'john.doe@gmail.com' }),
          Customer.create({ first_name: 'Jane', last_name: 'Doe', email: 'jane.doe@gmail.com' })
        ]);
        res = await request(app).get('/customers');
      });

      it('status is 200', async () => {
        expect(res.status).toBe(200);
      });

      it('the returned data is an array containing two elements', async () => {
        expect(Array.isArray(res.body.data));
        expect(res.body.data.length).toBe(2);
      });
    });
  });

  describe('POST /customers', () => {
    describe('when a valid payload is sent', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/customers').send({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@gmail.com'
        });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created customer', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });

    describe('when a customer with the same email already exists in DB', () => {
      let res;
      beforeAll(async () => {
        Customer.create({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@gmail.com'
        });
        res = await request(app).post('/customers').send({
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'john.doe@gmail.com'
        });
      });

      it('returns a 400 status', async () => {
        expect(res.status).toBe(400);
      });

      it('retuns an error message', async () => {
        expect(res.body).toHaveProperty('errorMessage');
      });
    });
  });
});
