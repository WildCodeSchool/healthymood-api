const db = require('../db.js');

class GenericPage {
  constructor (genericPage) {
    this.id = genericPage.id;
    this.title = genericPage.title;
    this.slug = genericPage.slug;
    this.published = genericPage.published;
    this.content = genericPage.content;
    this.user_id = genericPage.user_id;
    this.display_in_footer = genericPage.display_in_footer;
  }

  static async create (newGenericPage) {
    return db
      .query('INSERT INTO generic_pages SET ?', newGenericPage)
      .then((res) => {
        newGenericPage.id = res.insertId;
        return newGenericPage;
      });
  }

  static async findById (id) {
    return db
      .query('SELECT * FROM generic_pages WHERE id = ?', [id])
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

  static async findBySlug (slug) {
    return db
      .query('SELECT * FROM generic_pages WHERE slug = ?', [slug])
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

  static async nameAlreadyExists (slug) {
    return db
      .query('SELECT * FROM generic_pages WHERE slug = ?', [slug])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  }

  static async getAll (result) {
    return db.query('SELECT * FROM generic_pages');
  }

  static async getSome (limit, offset) {
    const total = await db.query('select count(id) as count from generic_pages').then(rows => rows[0].count);
    let sql = 'select * from generic_pages';
    if (limit !== undefined && offset !== undefined) {
      sql += ` limit ${limit} offset ${offset}`;
    }
    return db.query(sql).then(rows => ({
      results: rows.map(gp => new GenericPage(gp)),
      total
    }));
  }

  static async updateById (id, genericPages) {
    return db
      .query(
        'UPDATE generic_pages SET title = ?, slug = ?, published = ?, content = ?, user_id = ?, display_in_footer = ? WHERE id = ?',
        [
          genericPages.title,
          genericPages.slug,
          genericPages.published,
          genericPages.content,
          genericPages.user_id,
          genericPages.display_in_footer,
          id
        ]
      )
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db
      .query('DELETE FROM generic_pages WHERE id = ?', id)
      .then((res) => {
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
    return db.query('DELETE FROM generic_pages');
  }
}

module.exports = GenericPage;
