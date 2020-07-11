const request = require('supertest');
const app = require('../server.js');
const Recipe = require('../models/recipe.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('Recipes endpoints', () => {
  describe('GET /recipes', () => {
    describe('when there are three recipes in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Recipe.create({
            name: 'salade de pâte',
            image: '/ma-super-image',
            content: 'awesome content',
            created_at: '2020-12-30 23:59:59',
            preparation_duration_seconds: 1200,
            budget: 5,
            slug: 'ma-recette',
            published: true,
            user_id: 1
          }),
          Recipe.create({
            name: 'salade de riz',
            image: '/ma-super-image-riz',
            content: 'awesome recipe',
            created_at: '2020-08-30 23:59:59',
            preparation_duration_seconds: 1300,
            budget: 4,
            slug: 'ma-recette-riz',
            published: true,
            user_id: 1
          }),
          Recipe.create({
            name: 'salade de pommes de terre',
            image: '/ma-super-image-de-patates',
            content: 'awesome patates',
            created_at: '2020-12-30 23:59:59',
            preparation_duration_seconds: 1500,
            budget: 3,
            slug: 'ma-recette-patates',
            published: false,
            user_id: 1
          })
        ]);
        res = await request(app).get('/recipes');
      });

      it('status is 200', async () => {
        expect(res.status).toBe(200);
      });

      it('the returned data is an array containing three elements', async () => {
        expect(Array.isArray(res.body.data));
        expect(res.body.data.length).toBe(3); // <-- Ahahaha des barres
      });
    });
  });

  describe('POST /recipes', () => {
    describe('when a user is not authenticated on admin', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/dish_types').send({
          name: 'salade de pommes de terre',
          image: '/ma-super-image-de-patates',
          content: 'awesome patates',
          created_at: '2020-12-30 23:59:59',
          preparation_duration_seconds: 1500,
          budget: 3,
          slug: 'ma-recette-patates',
          published: false,
          user_id: 1
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
          .post('/recipes')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'salade de pommes de terre',
            image: '/ma-super-image-de-patates',
            content: 'awesome patates',
            created_at: '2020-12-30 23:59:59',
            preparation_duration_seconds: 1500,
            budget: 3,
            slug: 'ma-recette-patates',
            calories: 400,
            published: false,
            user_id: 1
          });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created recipe', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
      it('returns the title and content of the created recipe', async () => {
        expect(res.body.data).toHaveProperty('name');
        expect(res.body.data).toHaveProperty('content');
      });
    });
  });
});
