const db = require('../db.js');

class Addresse {
  constructor (addresse) {
    this.id = addresse.id;
    this.street = addresse.street;
    this.zipcode = addresse.zipcode;
    this.city = addresse.city;
    this.country = addresse.country;
  }

  static async create (newAddresse) {
    return db
      .query('INSERT INTO addresses SET ?', newAddresse)
      .then((res) => {
        newAddresse.id = res.insertId;
        return newAddresse;
      });
  }

  static async findById (id) {
    return db
      .query('SELECT * FROM addresses WHERE id = ?', [id])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(rows[0]);
        } else {
          const err = new Error();
          err.kind = 'not_found';
          return Promise.reject(err);
        }
      });
  }

  static async getAll (result) {
    return db.query('SELECT * FROM addresses');
  }

  static async updateById (id, addresse) {
    return db
      .query('UPDATE addresses SET street = ?, zipcode = ?, city = ?, country = ? WHERE id = ?', [
        addresse.street,
        addresse.zipcode,
        addresse.city,
        addresse.country,
        id
      ])
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM addresses WHERE id = ?', id).then((res) => {
      if (res.affectedRows !== 0) {
        return Promise.resolve();
      } else {
        const err = new Error();
        err.kind = 'not_found';
        return Promise.reject(err);
      }
    });
  }

  static async removeAll (result) {
    return db.query('DELETE FROM addresses');
  }
}

module.exports = Addresse;
