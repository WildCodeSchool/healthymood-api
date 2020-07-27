const db = require('../db.js');

class Article {
  constructor (article) {
    this.id = article.id;
    this.title = article.title;
    this.slug = article.slug;
    this.content = article.content;
    this.image = article.image;
    this.created_at = article.created_at;
    this.updated_at = article.updated_at;
    this.user_id = article.user_id;
    this.intro = article.intro;
  }

  static async create (newArticle) {
    return db
      .query('INSERT INTO articles SET ?', newArticle)
      .then((res) => {
        newArticle.id = res.insertId;
        return newArticle;
      });
  }

  static async slugAlreadyExists (slug) {
    return db
      .query('SELECT * FROM articles WHERE slug = ?', [slug])
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });
  }

  static async findById (id) {
    return db
      .query('SELECT * FROM articles WHERE id = ?', [id])
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
      .query('SELECT * FROM articles WHERE slug = ?', [slug])
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

  static async getArticleCategory(article_id) {// eslint-disable-line
    return db
      .query(
        'SELECT ac.name,ac.id FROM article_categories as ac  LEFT JOIN articles ON ac.id = articles.article_category_id WHERE articles.id = ?',
        [article_id] // eslint-disable-line
      )
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(rows[0]);
        } else {
          return Promise.resolve(null);
        }
      });
  }

  static async setCategoryArticle(article_id, category_id) {// eslint-disable-line
    return db
      .query(
        'UPDATE articles SET article_category_id = ? WHERE id = ? ', [category_id, article_id])// eslint-disable-line
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(rows[0]);
        } else {
          return Promise.resolve(null);
        }
      });
  }

  static async getArticleAuthor(user_id) { // eslint-disable-line
    return db
      .query(
        'SELECT users.username FROM articles LEFT JOIN users ON users.id = articles.user_id WHERE user_id = ?', // eslint-disable-next-line
        [user_id]
      )
      .then((rows) => {
        if (rows.length) {
          return Promise.resolve(rows[0]);
        } else {
          return Promise.resolve(null);
        }
      });
  }

  static async getSome (limit, offset, sortOrder = 'asc', orderBy, keyword) {
    const sqlValues = `%${keyword}%`;
    const sqltotal = 'select count(id) as count from articles';
    let total = 0;
    let sql = 'select * from articles';
    if (keyword) {
      total = await db.query('select count(id) as count from articles  WHERE title LIKE ? OR content LIKE ?', [sqlValues, sqlValues]).then(rows => rows[0].count);
      sql += ' WHERE title LIKE ? OR content LIKE ?';
    } else {
      total = await db.query(sqltotal).then(rows => rows[0].count);
    }
    if (orderBy) {
      sortOrder = (typeof sortOrder === 'string' && sortOrder.toLowerCase()) === 'desc' ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${db.escapeId(orderBy)} ${sortOrder}`;
    }
    if (limit !== undefined && offset !== undefined) {
      sql += ` limit ${limit} offset ${offset}`;
    }
    return db.query(sql, keyword ? [sqlValues, sqlValues] : []).then(rows => ({
      results: rows.map(a => new Article(a)),
      total
    }));
  }

  static async updateById (id, article) {
    return db
      .query('UPDATE articles SET title = ?, slug = ?, content = ?, image = ?, user_id = ?, intro = ? WHERE id = ?', [
        article.title,
        article.slug,
        article.content,
        article.image,
        article.user_id,
        article.intro,
        id
      ])
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM articles WHERE id = ?', id).then((res) => {
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
    return db.query('DELETE FROM articles');
  }
}

module.exports = Article;
