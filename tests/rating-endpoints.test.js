const request = require('supertest');
const app = require('../server.js');
const Rating = require('../models/rating.model.js');
const Recipe = require('../models/recipe.model');
const authenticateUser = require('./helpers/authenticateUser');

describe('ratings endpoints', () => {
  describe('GET /ratings', () => {
    describe('when there are three ratings in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Rating.create({
            score: 3,
            user_id: 1,
            recipe_id: 4
          }),
          Rating.create({
            score: 2,
            user_id: 6,
            recipe_id: 1
          }),
          Rating.create({
            score: 5,
            user_id: 4,
            recipe_id: 3
          })
        ]);
        res = await request(app).get('/ratings');
      });

      it('status is 200', async () => {
        expect(res.status).toBe(200);
      });

      it('the returned data is an array containing three elements', async () => {
        expect(Array.isArray(res.body.data));
        expect(res.body.data.length).toBe(3);
      });
    });
  });

  describe('POST /ratings', () => {
    describe('when a valid payload is sent', () => {
      let res;
      let currentUser = null;
      let recipe = null;

      beforeAll(async () => {
        const { token, user } = await authenticateUser();
        currentUser = user;
        recipe = await Recipe.create({
          name: 'gratin de pommes de terre',
          image: '/ma-super-image-de-patates',
          content: 'awesome patates',
          created_at: '2020-12-30 23:59:59',
          preparation_duration_seconds: 1500,
          budget: 3,
          slug: 'ma-recette-patates',
          published: false,
          user_id: currentUser.id
        });

        res = await request(app)
          .post('/ratings')
          .set('Authorization', `Bearer ${token}`)
          .send({
            score: 5,
            recipe_id: recipe.id
          });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created rating', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
      it('returns the score and content of the created rating', async () => {
        expect(res.body.data.score).toEqual(5);
        expect(res.body.data.recipe_id).toEqual(recipe.id);
        expect(res.body.data.user_id).toEqual(currentUser.id);
      });
    });
  });
});
