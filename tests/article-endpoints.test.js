const request = require('supertest');
const app = require('../server.js');
const Article = require('../models/article.model.js');

describe('Articles endpoints', () => {
  describe('GET /articles', () => {
    describe('Last articles', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Article.create({
            title: 'premier article',
            slug: 'premier-article',
            content: 'Awesome content',
            image: '/ma-super-image',
            created_at: '2020-12-30 23:59:59',
            article_category_id: 3,
            user_id: 1
          }),
          Article.create({
            title: 'deuxième article',
            slug: 'deuxieme-article',
            content: 'Awesome content',
            image: '/ma-super-image',
            created_at: '2010-12-30 23:59:59',
            article_category_id: 2,
            user_id: 1
          }),
          Article.create({
            title: 'troisième article',
            slug: 'troisieme-article',
            content: 'Awesome content',
            image: '/ma-super-image',
            created_at: '2018-12-30 23:59:59',
            article_category_id: 1,
            user_id: 1
          })
        ]);
        res = await request(app).get('/articles?per_page=2&sort_by=created_at&sort_order=desc');
      });
      it('status is 200', async () => {
        expect(res.status).toBe(200);
      });

      it('the returned data is an array containing two elements', async () => {
        expect(Array.isArray(res.body.data));
        expect(res.body.data.length).toBe(2);
        expect(res.body.data[0].title).toBe('premier article');
        expect(res.body.data[1].title).toBe('troisième article');
      });
    });

    describe(' GET /articles/?search=keyword', () => {
      describe(' when there are 3 articles in DB but only two matching', () => {
        let res;
        beforeEach(async () => {
          await Promise.all([
            Article.create({
              title: 'Salade de riz',
              slug: 'premier-article',
              content: 'Awesome content',
              image: '/ma-super-image',
              created_at: '2020-12-30 23:59:59',
              article_category_id: 3,
              user_id: 1
            }),
            Article.create({
              title: 'Salade de pates',
              slug: 'deuxieme-article',
              content: 'Awesome content',
              image: '/ma-super-image',
              created_at: '2020-12-30 23:59:59',
              article_category_id: 3,
              user_id: 1
            }),
            Article.create({
              title: 'Riz au lait',
              slug: 'troisieme-article',
              content: 'Awesome content',
              image: '/ma-super-image',
              created_at: '2020-12-30 23:59:59',
              article_category_id: 3,
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
          expect(res.body.data.length).toBe(2); // <-- Ahahaha des barres
        });
      });
    });

    describe('when there are three articles in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Article.create({
            title: 'premier article',
            slug: 'premier-article',
            content: 'Awesome content',
            image: '/ma-super-image',
            created_at: '2020-12-30 23:59:59',
            article_category_id: 3,
            user_id: 1
          }),
          Article.create({
            title: 'deuxième article',
            slug: 'deuxieme-article',
            content: 'Awesome content',
            image: '/ma-super-image',
            created_at: '2020-12-30 23:59:59',
            article_category_id: 2,
            user_id: 1
          }),
          Article.create({
            title: 'troisième article',
            slug: 'troisieme-article',
            content: 'Awesome content',
            image: '/ma-super-image',
            created_at: '2020-12-30 23:59:59',
            article_category_id: 1,
            user_id: 1
          })
        ]);
        res = await request(app).get('/articles');
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

  describe('POST /articles', () => {
    describe('when a valid payload is sent', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/articles').send({
          title: 'article de malade mental',
          slug: 'article-de-malade-mental',
          content: 'my content is crazy as fuck',
          image: '/ma-super-image',
          created_at: '2020-12-30 23:59:59',
          article_category_id: 1,
          user_id: 1
        });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created article', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
      it('returns the title and content of the created article', async () => {
        expect(res.body.data).toHaveProperty('title');
        expect(res.body.data).toHaveProperty('content');
      });
    });
  });
});
