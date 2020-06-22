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

  static async getAll (result) {
    return db.query('SELECT * FROM articles');
  }

  static async updateById (id, article) {
    return db
      .query('UPDATE articles SET title = ?, slug = ?, content = ?, image = ?, created_at = ?, updated_at = ?, article_category_id = ?, user_id = ? WHERE id = ?', [
        article.title,
        article.slug,
        article.content,
        article.image,
        article.created_at,
        article.updated_at,
        article.article_category_id,
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
