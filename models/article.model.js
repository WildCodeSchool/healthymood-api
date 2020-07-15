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
    this.article_category_id = article.article_category_id;
    this.user_id = article.user_id;
  }

  static async create (newArticle) {
    return db
      .query('INSERT INTO articles SET ?', newArticle)
      .then((res) => {
        newArticle.id = res.insertId;
        return newArticle;
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

  static async getArticleAuthor (user_id) { // eslint-disable-line
    return db
      .query(
        'SELECT users.username FROM articles LEFT JOIN users ON users.id = articles.user_id WHERE user_id = ?', // eslint-disable-next-line
        [user_id]
      )
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

  static async findByKeyWord (keyword) {
    const sqlValues = `%${keyword}%`;
    return db.query(
      'SELECT * FROM articles WHERE title LIKE ? OR content LIKE ?',
      [sqlValues, sqlValues]
    );
  }

  static async getSome (limit, offset, sortOrder = 'asc', orderBy) {
    const total = await db.query('select count(id) as count from articles').then(rows => rows[0].count);
    let sql = 'select * from articles';
    if (orderBy) {
      sortOrder = (typeof sortOrder === 'string' && sortOrder.toLowerCase()) === 'desc' ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${db.escapeId(orderBy)} ${sortOrder}`;
    }
    if (limit !== undefined && offset !== undefined) {
      sql += ` limit ${limit} offset ${offset}`;
    }
    return db.query(sql).then(rows => ({
      results: rows.map(a => new Article(a)),
      total
    }));
  }

  static async updateById (id, article) {
    return db
      .query('UPDATE articles SET title = ?, slug = ?, content = ?, user_id = ? WHERE id = ?', [
        article.title,
        article.slug,
        article.content,
        article.user_id,
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
