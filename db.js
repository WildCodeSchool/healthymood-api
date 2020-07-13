const mysql = require('mysql');
class Database {
  init () {
    let config = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '3307',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'healthymood_api_database',
      connectionLimit: 10,
      multipleStatements: true
    };

    if (process.env.NODE_ENV === 'test') {
      config = {
        host: process.env.DB_HOST_TEST || 'localhost',
        port: process.env.DB_PORT_TEST || '3308',
        user: process.env.DB_USER_TEST || 'root',
        password: process.env.DB_PASS_TEST || 'root',
        database: process.env.DB_NAME_TEST || 'healthymood_api_database_test',
        connectionLimit: 10,
        multipleStatements: true
      };
    }

    this.connection = mysql.createPool(config);
    return this;
  }

  query (...args) {
    return new Promise((resolve, reject) => {
      this.connection.query(...args, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  escape (value) {
    return this.connection.escape(value);
  }

  escapeId (value) {
    return this.connection.escapeId(value);
  }

  closeConnection () {
    return new Promise((resolve, reject) => {
      if (this.connection) {
        this.connection.end((err, res) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        return resolve();
      }
    });
  }

  async deleteAllData () {
    if (process.env.NODE_ENV !== 'test') throw new Error('Cannot truncate all table if not in test env !');
    const truncates = await this.getTableNames().then(rows => rows.map(row => `TRUNCATE ${row.TABLE_NAME};`).join(' '));
    const sql = `SET FOREIGN_KEY_CHECKS=0; ${truncates} SET FOREIGN_KEY_CHECKS=1;`;
    return this.query(sql);
  }

  async getTableNames () {
    if (!this._tableNames) {
      this._tableNames = await this.query(`
          SELECT TABLE_NAME
          FROM INFORMATION_SCHEMA.TABLES where table_schema = '${process.env.DB_NAME_TEST || 'healthymood_api_database_test'}' and table_name != 'migrations'
      `);
    }
    return this._tableNames;
  }
}

module.exports = new Database().init();
