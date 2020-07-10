const request = require('supertest');
const app = require('../server.js');
const User = require('../models/user.model.js');

describe('auth endpoints', () => {
  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      await User.create({
        username: 'john doe',
        email: 'john.doe@gmail.com',
        password: 'admin123',
        blocked: false,
        is_admin: true
      });
      await request(app)
        .post('/auth/login')
        .send({ email: 'john.doe@gmail.com', password: 'admin123' })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('token');
        });
    });
    it('should not login with invalid credentials', async () => {
      await User.create({
        username: 'john doe',
        email: 'john.doe@gmail.com',
        password: 'admin123',
        blocked: false,
        is_admin: true
      });
      await request(app)
        .post('/auth/login')
        .send({ email: 'jane.doe@gmail.com', password: 'admin456' })
        .expect(400)
        .then((res) => {
          expect(res.body).toHaveProperty('message');
        });
    });
  });
});
