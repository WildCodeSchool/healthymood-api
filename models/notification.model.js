const db = require('../db.js');

class Notification {
  constructor (notification) {
    this.id = notification.id;
    this.title = notification.title;
    this.content = notification.content;
    this.link = notification.link;
    this.dispatch_planning = notification.dispatch_planning;
  }

  static async create (newNotification) {
    return db
      .query('INSERT INTO notifications SET ?', newNotification)
      .then((res) => {
        newNotification.id = res.insertId;
        return newNotification;
      });
  }

  static async findById (id) {
    return db
      .query('SELECT * FROM notifications WHERE id = ?', [id])
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
    return db.query('SELECT * FROM notifications');
  }

  static async updateById (id, notification) {
    return db
      .query('UPDATE notifications SET title = ?, content = ?, link = ?, dispatch_planning = ? WHERE id = ?', [
        notification.title,
        notification.content,
        notification.link,
        notification.dispatch_planning,
        id
      ])
      .then(() => this.findById(id));
  }

  static async remove (id) {
    return db.query('DELETE FROM notifications WHERE id = ?', id).then((res) => {
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
    return db.query('DELETE FROM notifications');
  }
}

module.exports = Notification;
