const db = require('../db.js');

class ArticleCategory {
  constructor (articleCategory) {
    this.id = articleCategory.id;
    this.name = articleCategory.name;
  }

  static async create (newArticleCategory) {
    return db
      .query('INSERT INTO article_categories SET ?', newArticleCategory)
      .then((res) => {
        newArticleCategory.id = res.insertId;
        return newArticleCategory;
      });
  }

  static async findById (id) {
    return db
      .query('SELECT * FROM article_categories WHERE id = ?', [id])
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

  static async nameAlreadyExists (name) {
    return db
      .query('SELECT * FROM article_categories WHERE name = ?', [name])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  }

  static async getAll (result) {
    return db.query('SELECT * FROM article_categories');
  }

  static async getSome (limit, offset) {
    const total = await db.query('select count(id) as count from article_categories').then(rows => rows[0].count);
    let sql = 'select * from article_categories';
    if (limit !== undefined && offset !== undefined) {
      sql += ` limit ${limit} offset ${offset}`;
    }
    return db.query(sql).then(rows => ({
      results: rows.map(ac => new ArticleCategory(ac)),
      total
    }));
  }

  static async updateById (id, articleCategory) {
    return db
      .query('UPDATE article_categories SET name = ? WHERE id = ?', [
        articleCategory.name,
        id
      ])
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM article_categories WHERE id = ?', id).then((res) => {
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
    return db.query('DELETE FROM article_categories');
  }
}

module.exports = ArticleCategory;
