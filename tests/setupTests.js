const db = require('../db.js');
const app = require('../server.js');

const deleteAllDBData = async () => {
  return db.deleteAllData();
};
const closeApp = () =>
  new Promise((resolve, reject) => {
    app.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

beforeAll(async () => {
  db.init();
});
beforeAll(deleteAllDBData);
afterEach(deleteAllDBData);
afterAll(async () => {
  await db.closeConnection();
  await closeApp();
});
