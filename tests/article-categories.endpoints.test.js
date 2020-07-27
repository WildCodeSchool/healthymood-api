const request = require('supertest');
const app = require('../server.js');
const ArticleCategory = require('../models/article-categories.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('article categories endpoints', () => {
  describe('GET /article_categories', () => {
    describe('when there are two article categories in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          ArticleCategory.create({ name: 'information' }),
          ArticleCategory.create({ name: 'a la une' })
        ]);
        res = await request(app).get('/article_categories');
      });
      it('status is 200', async () => {
        expect(res.status).toBe(200);
      });

      it('the returned data is an array containing two elements', async () => {
        expect(Array.isArray(res.body.data));
        expect(res.body.data.length).toBe(2);
      });
    });

    describe('Paginated article categories', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          ArticleCategory.create({ name: 'info' }),
          ArticleCategory.create({ name: 'dernières actu' }),
          ArticleCategory.create({ name: 'actu vegan' }),
          ArticleCategory.create({ name: 'remplacer le lait' }),
          ArticleCategory.create({ name: 'comment manger sans gluten' }),
          ArticleCategory.create({ name: 'aliments contenants du gluten' }),
          ArticleCategory.create({ name: 'aliments contenant du lactose' }),
          ArticleCategory.create({ name: 'aliments healthy' }),
          ArticleCategory.create({ name: 'remplacer les oeufs' }),
          ArticleCategory.create({ name: 'aliments allergènes' }),
          ArticleCategory.create({ name: 'les fruits à coques' }),
          ArticleCategory.create({ name: 'scoop sur le soja' }),
          ArticleCategory.create({ name: 'les smoothies' }),
          ArticleCategory.create({ name: 'remplacer le beurre' }),
          ArticleCategory.create({ name: 'informations' })
        ]);
        res = await request(app).get('/article_categories?per_page=8&page=1');
      });

      it('has 10 ressources per page', async () => {
        expect(res.body.data.length).toBe(8);
        expect(res.header['content-range']).toBe('1-8/15');
      });
    });
  });

  describe('POST /article_categories', () => {
    describe('when a user is not authenticated on admin', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/article_categories').send({
          name: 'info'
        });
      });

      it('returns 401 status', async () => {
        expect(res.statusCode).toEqual(401);
      });
    });
    describe('when user is authenticated', () => {
      let res;
      let token;
      beforeAll(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        res = await request(app)
          .post('/article_categories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'info'
          });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created category', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });

    describe('when a article categories with the same name already exists in DB', () => {
      let res;
      let token;
      beforeAll(async () => {
        await ArticleCategory.create({
          name: 'follow'
        });
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        res = await request(app)
          .post('/article_categories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'follow'
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
