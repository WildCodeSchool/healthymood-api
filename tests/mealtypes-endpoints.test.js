const request = require('supertest');
const app = require('../server.js');
const Mealtypes = require('../models/meal_types.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('mealtypes endpoints', () => {
  describe('GET /meal_types', () => {
    describe('when there are two mealtypes in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Mealtypes.create({ name: 'entrée' }),
          Mealtypes.create({ name: 'dessert' })
        ]);
        res = await request(app).get('/meal_types');
      });
      it('status is 200', async () => {
        expect(res.status).toBe(200);
      });
      it('the returned data is an array containing two elements', async () => {
        expect(Array.isArray(res.body.data));
        expect(res.body.data.length).toBe(2);
      });
    });
    describe('Paginated meal types', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Mealtypes.create({ name: 'entrée' }),
          Mealtypes.create({ name: 'plat' }),
          Mealtypes.create({ name: 'dessert' }),
          Mealtypes.create({ name: 'apéro' }),
          Mealtypes.create({ name: 'brunch' }),
          Mealtypes.create({ name: 'buffet froid' }),
          Mealtypes.create({ name: 'buffet chaud' }),
          Mealtypes.create({ name: 'cocktail' }),
          Mealtypes.create({ name: 'sur le pouce' }),
          Mealtypes.create({ name: 'famille nombreuses' }),
          Mealtypes.create({ name: 'entrée 1' }),
          Mealtypes.create({ name: 'plat 1' }),
          Mealtypes.create({ name: 'dessert 1' }),
          Mealtypes.create({ name: 'apéro 1' }),
          Mealtypes.create({ name: 'brunch 1' })
        ]);
        res = await request(app).get('/meal_types?per_page=8&page=1');
      });

      it('has 8 ressources per page', async () => {
        expect(res.body.data.length).toBe(8);
        expect(res.header['content-range']).toBe('1-8/15');
      });
    });
  });
  describe('POST /meal_types', () => {
    describe('when a user is not authenticated on admin', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/dish_types').send({
          name: 'dessert'
        });
      });

      it('returns 401 status', async () => {
        expect(res.statusCode).toEqual(401);
      });
    });
    describe('when a valid payload is sent', () => {
      let res;
      let token;
      beforeAll(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        res = await request(app)
          .post('/meal_types')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'dessert'
          });
      });
      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created mealtypes', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });
    describe('when a mealtype with the same name already exists in DB', () => {
      let res;
      let token;
      beforeAll(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        await Mealtypes.create({
          name: 'brunch'
        });
        res = await request(app)
          .post('/meal_types')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'brunch'
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
