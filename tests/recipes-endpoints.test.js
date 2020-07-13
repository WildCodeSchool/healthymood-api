const request = require('supertest');
const app = require('../server.js');
const Recipe = require('../models/recipe.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('Recipes endpoints', () => {
  describe('GET /recipes', () => {
    describe('Last recipes', () => {
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
            created_at: '2010-12-30 23:59:59',
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
            created_at: '2018-12-30 23:59:59',
            preparation_duration_seconds: 1500,
            budget: 3,
            slug: 'ma-recette-patates',
            published: false,
            user_id: 1
          })
        ]);
        res = await request(app).get(
          '/recipes?per_page=2&sort_by=created_at&sort_order=desc'
        );
      });
      it('status is 200', async () => {
        expect(res.status).toBe(200);
      });

      it('the returned data is an array containing two elements', async () => {
        expect(Array.isArray(res.body.data));
        expect(res.body.data.length).toBe(2);
        expect(res.body.data[0].title).toBe('salade de pâte');
        expect(res.body.data[1].title).toBe('salade de pommes de terre');
      });
    });
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

    describe('Paginated recipes', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Recipe.create({
            name: 'salade de pommes de terre',
            image: '/ma-super-image-de-patates',
            content: 'super patates',
            created_at: '2020-12-30 23:59:59',
            preparation_duration_seconds: 1500,
            budget: 3,
            slug: 'ma-recette-patates',
            published: false,
            user_id: 1
          }),
          Recipe.create({
            name: 'salade de pommes de pâtes',
            image: '/ma-super-image-de-pâtes',
            content: 'super pates',
            created_at: '2020-12-12 22:59:59',
            preparation_duration_seconds: 1400,
            budget: 3,
            slug: 'ma-recette-pâtes',
            published: false,
            user_id: 5
          }),
          Recipe.create({
            name: 'salade de riz',
            image: '/ma-super-image-de-riz',
            content: 'super riz',
            created_at: '2020-12-11 21:59:59',
            preparation_duration_seconds: 1300,
            budget: 3,
            slug: 'ma-recette-riz',
            published: false,
            user_id: 5
          }),
          Recipe.create({
            name: 'barbeuc',
            image: '/ma-super-image-de-barbeuc',
            content: 'super barbeuc',
            created_at: '2020-12-10 20:59:59',
            preparation_duration_seconds: 1600,
            budget: 3,
            slug: 'ma-recette-barbeuc',
            published: false,
            user_id: 2
          }),
          Recipe.create({
            name: 'soupe de butternut',
            image: '/ma-super-image-de-butternut',
            content: 'super butternut',
            created_at: '2020-12-9 19:59:59',
            preparation_duration_seconds: 1200,
            budget: 3,
            slug: 'ma-recette-butternut',
            published: false,
            user_id: 3
          }),
          Recipe.create({
            name: 'taboulé traditionnel',
            image: '/ma-super-image-de-taboulé',
            content: 'super taboulé',
            created_at: '2020-12-9 18:59:59',
            preparation_duration_seconds: 1100,
            budget: 3,
            slug: 'ma-recette-taboulé',
            published: false,
            user_id: 3
          }),
          Recipe.create({
            name: 'taboulé au quinoa',
            image: '/ma-super-image-de-quinoa',
            content: 'super quinoa',
            created_at: '2020-12-30 21:59:59',
            preparation_duration_seconds: 1500,
            budget: 3,
            slug: 'ma-recette-quinoa',
            published: false,
            user_id: 4
          }),
          Recipe.create({
            name: 'gaspacho',
            image: '/ma-super-image-de-gaspacho',
            content: 'super gaspacho',
            created_at: '2020-12-5 17:59:59',
            preparation_duration_seconds: 1500,
            budget: 3,
            slug: 'ma-recette-gaspacho',
            published: false,
            user_id: 1
          }),
          Recipe.create({
            name: 'brandade de morue',
            image: '/ma-super-image-de-morue',
            content: 'super morue',
            created_at: '2020-12-7 22:59:59',
            preparation_duration_seconds: 1500,
            budget: 3,
            slug: 'ma-recette-morue',
            published: false,
            user_id: 8
          }),
          Recipe.create({
            name: 'thé detox',
            image: '/ma-super-image-de-thé',
            content: 'super thé',
            created_at: '2020-12-30 23:59:59',
            preparation_duration_seconds: 1500,
            budget: 3,
            slug: 'ma-recette-thé',
            published: false,
            user_id: 9
          }),
          Recipe.create({
            name: 'salade de tomate',
            image: '/ma-super-image-de-tomate',
            content: 'super tomate',
            created_at: '2020-12-30 23:59:59',
            preparation_duration_seconds: 1500,
            budget: 3,
            slug: 'ma-recette-tomate',
            published: false,
            user_id: 5
          }),
          Recipe.create({
            name: 'salade de concombre',
            image: '/ma-super-image-de-concombre',
            content: 'super concombre',
            created_at: '2020-12-30 23:59:59',
            preparation_duration_seconds: 900,
            budget: 3,
            slug: 'ma-recette-concombre',
            published: false,
            user_id: 1
          }),
          Recipe.create({
            name: 'gratin de pommes de terre',
            image: '/ma-super-image-de-gratin',
            content: 'super gratin',
            created_at: '2020-12-30 23:59:59',
            preparation_duration_seconds: 2000,
            budget: 3,
            slug: 'ma-recette-gratin',
            published: false,
            user_id: 3
          }),
          Recipe.create({
            name: 'gratin d\'aubergine',
            image: '/ma-super-image-de-aubergine',
            content: 'super aubergine',
            created_at: '2020-12-30 23:59:59',
            preparation_duration_seconds: 1500,
            budget: 3,
            slug: 'ma-recette-aubergine',
            published: false,
            user_id: 7
          }),
          Recipe.create({
            name: 'soupe au pistou',
            image: '/ma-super-image-de-pistou',
            content: 'super pistou',
            created_at: '2020-12-30 23:59:59',
            preparation_duration_seconds: 500,
            budget: 3,
            slug: 'ma-recette-pistou',
            published: false,
            user_id: 7
          })
        ]);
        res = await request(app).get('/recipes?per_page=8&page=1');
      });

      it('has 8 ressources per page', async () => {
        expect(res.body.data.length).toBe(8);
        expect(res.header['content-range']).toBe('1-8/15');
      });
    });
  });

  describe(' GET /recipes/?search=keyword', () => {
    describe(' when there are 3 recipes in DB but only two matching', () => {
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
            name: 'gratin de pommes de terre',
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
        res = await request(app).get('/recipes/?search=salade');
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
