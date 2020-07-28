const request = require('supertest');
const app = require('../server.js');
const Article = require('../models/article.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

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
        res = await request(app).get(
          '/articles?per_page=2&sort_by=created_at&sort_order=desc'
        );
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
        expect(res.body.data.length).toBe(3);
      });
    });

    describe('Paginated articles', () => {
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
            title: 'second article',
            slug: 'deuxieme-article',
            content: 'Awesome content',
            image: '/ma-super-image',
            created_at: '2020-12-30 23:59:59',
            article_category_id: 3,
            user_id: 1
          }),
          Article.create({
            title: 'article de malade mental',
            slug: 'article-de-malade-mental',
            content: 'my content is crazy as fuck',
            image: '/ma-super-image',
            created_at: '2020-12-30 23:59:59',
            article_category_id: 1,
            user_id: 1
          }),
          Article.create({
            title: 'article de fou mental',
            slug: 'article-de-fou-mental',
            content: 'my content is crazy as fuck',
            image: '/ma-super-image',
            created_at: '2020-12-30 23:59:59',
            article_category_id: 1,
            user_id: 1
          }),
          Article.create({
            title: 'cinquième article',
            slug: 'cinquième-article',
            content: 'Awesome content',
            image: '/ma-super-image',
            created_at: '2020-12-30 23:59:59',
            article_category_id: 3,
            user_id: 1
          }),
          Article.create({
            title: 'sixième article',
            slug: 'sixième-article',
            content: 'Awesome content',
            image: '/ma-super-image',
            created_at: '2020-12-30 23:59:59',
            article_category_id: 3,
            user_id: 1
          }),
          Article.create({
            title: 'septième article',
            slug: 'septième-article',
            content: 'Awesome content',
            image: '/ma-super-image',
            created_at: '2020-12-30 23:59:59',
            article_category_id: 3,
            user_id: 1
          }),
          Article.create({
            title: 'huitième article',
            slug: 'huitième-article',
            content: 'Awesome content',
            image: '/ma-super-image',
            created_at: '2020-12-30 23:59:59',
            article_category_id: 3,
            user_id: 1
          }),
          Article.create({
            title: 'neuvième article',
            slug: 'neuvième-article',
            content: 'Awesome content',
            image: '/ma-super-image',
            created_at: '2020-12-30 23:59:59',
            article_category_id: 3,
            user_id: 1
          }),
          Article.create({
            title: 'dixième article',
            slug: 'dixième-article',
            content: 'Awesome content',
            image: '/ma-super-image',
            created_at: '2020-12-30 23:59:59',
            article_category_id: 3,
            user_id: 1
          })
        ]);
        res = await request(app).get('/articles?per_page=8&page=1');
      });

      it('status is 200', async () => {
        expect(res.body.data.length).toBe(8);
        expect(res.header['content-range']).toBe('1-8/10');
      });
    });
  });

  describe('POST /articles', () => {
    describe('when a user is not authenticated on admin', () => {
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
          .post('/articles')
          .set('Authorization', `Bearer ${token}`)
          .send({
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
    });
  });
});
