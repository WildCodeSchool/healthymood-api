const request = require('supertest');
const app = require('../server.js');
const User = require('../models/user.model.js');

describe('secret endpoints', () => {
  describe('GET /secret', () => {
    it('should get secret with valid token', async () => {
      await User.create('john doe', 'john.doe@gmail.com', 'admin123');
      const { token } = await User.login('john.doe@gmail.com', 'admin123');
      await request(app).get('/secret')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(res => {
          expect(res.body).toHaveProperty('secret');
        });
    });

    it('should get a 401 with no token', async () => {
      await request(app).get('/secret').expect(401);
    });

    it('should get a 401 with invalid token', async () => {
      await request(app).get('/secret').set('Authorization', 'Bearer notvalid').expect(401);
    });
  });
});
