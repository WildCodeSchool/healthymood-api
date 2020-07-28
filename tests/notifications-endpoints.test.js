const request = require('supertest');
const app = require('../server.js');
const Notification = require('../models/notification.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('notifications endpoints', () => {
  describe('GET /notifications', () => {
    describe('when there are three notifications in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Notification.create({
            title: 'good bye',
            content: 'a+',
            link: 'to the past',
            dispatch_planning: '2020-12-31 23:59:59'
          }),
          Notification.create({
            title: 'get out from here',
            content: 'dégage',
            link: 'between world',
            dispatch_planning: '2020-12-31 23:59:59'
          }),
          Notification.create({
            title: 'hello world',
            content: 'salut',
            link: "'s awakening",
            dispatch_planning: '2020-12-31 23:59:59'
          })
        ]);
        res = await request(app).get('/notifications');
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

  describe('POST /notifications', () => {
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
          .post('/notifications')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'notif',
            content: 'a notif',
            link: 'https://google.com',
            dispatch_planning: '2020-12-31 23:59:59'
          });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created notification', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
      it('returns the title and content of the created notification', async () => {
        expect(res.body.data).toHaveProperty('title');
        expect(res.body.data).toHaveProperty('content');
      });
    });
  });
});
