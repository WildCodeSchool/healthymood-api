const request = require('supertest');
const app = require('../server.js');
const Recipe = require('../models/recipe.model');
const authenticateUser = require('./helpers/authenticateUser');

describe('favorites endpoints', () => {
  describe('POST /favorites', () => {
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
          calories: 400,
          published: false,
          user_id: currentUser.id
        });

        res = await request(app)
          .post('/favorites')
          .set('Authorization', `Bearer ${token}`)
          .send({
            recipe_id: recipe.id
          });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created favorite', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
      it('returns the score and content of the created favorite', async () => {
        expect(res.body.data.recipe_id).toEqual(recipe.id);
        expect(res.body.data.user_id).toEqual(currentUser.id);
      });
    });
  });
});
