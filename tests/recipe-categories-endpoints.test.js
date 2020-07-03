const request = require('supertest');
const app = require('../server.js');
const RecipesCategory = require('../models/recipe-categories.model.js');

describe('recipe-categories endpoints', () => {
  describe('GET /recipe-categories', () => {
    describe('when there are two recipe categories in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          RecipesCategory.create({ name: 'dejeuner' }),
          RecipesCategory.create({ name: 'diner' })
        ]);
        res = await request(app).get('/recipe_categories');
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

  describe('POST /recipe-categories', () => {
    describe('when a valid payload is sent', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/recipe_categories').send({
          name: 'dessert'
        });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created recipe-categories', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });

    describe('when a recipe-categories with the same name already exists in DB', () => {
      let res;
      beforeAll(async () => {
        await RecipesCategory.create({
          name: 'entrée'
        });
        res = await request(app).post('/recipe_categories').send({
          name: 'entrée'
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
