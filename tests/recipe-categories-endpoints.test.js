const request = require('supertest');
const app = require('../server.js');
const RecipesCategory = require('../models/recipe-categories.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('recipe-categories endpoints', () => {
  describe('GET /recipe_categories', () => {
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
    describe('Paginated recipe categories', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          RecipesCategory.create({ name: 'catégorie 1' }),
          RecipesCategory.create({ name: 'catégorie 2' }),
          RecipesCategory.create({ name: 'catégorie 3' }),
          RecipesCategory.create({ name: 'catégorie 4' }),
          RecipesCategory.create({ name: 'catégorie 5' }),
          RecipesCategory.create({ name: 'catégorie 6' }),
          RecipesCategory.create({ name: 'catégorie 7' }),
          RecipesCategory.create({ name: 'catégorie 8' }),
          RecipesCategory.create({ name: 'catégorie 9' }),
          RecipesCategory.create({ name: 'catégorie 10' }),
          RecipesCategory.create({ name: 'catégorie 11' }),
          RecipesCategory.create({ name: 'catégorie 12' }),
          RecipesCategory.create({ name: 'catégorie 13' }),
          RecipesCategory.create({ name: 'catégorie 14' }),
          RecipesCategory.create({ name: 'catégorie 15' })
        ]);
        res = await request(app).get('/recipe_categories?per_page=8&page=1');
      });

      it('has 8 ressources per page', async () => {
        expect(res.body.data.length).toBe(8);
        expect(res.header['content-range']).toBe('1-8/15');
      });
    });
  });

  describe('POST /recipe_categories', () => {
    describe('when a user is not authenticated on admin', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/recipe_categories').send({
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
          .post('/recipe_categories')
          .set('Authorization', `Bearer ${token}`)
          .send({
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
      let token;
      beforeAll(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        await RecipesCategory.create({
          name: 'entrée'
        });
        res = await request(app)
          .post('/recipe_categories')
          .set('Authorization', `Bearer ${token}`)
          .send({
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
