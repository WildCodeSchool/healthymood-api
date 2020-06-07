'use strict';
let dbm; // eslint-disable-line

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options) {
  dbm = options.dbmigrate;
};

exports.up = function (db) {
  // db.renameColumn is buggy on some mySQL versions ("cannot read COLUMN_TYPE...")
  return Promise.all([
    db.removeColumn('customers', 'name'),
    db.addColumn('customers', 'first_name', { type: 'string' }),
    db.addColumn('customers', 'last_name', { type: 'string' })
  ]);
};

exports.down = function (db) {
  return Promise.all([
    db.addColumn('customers', 'name', { type: 'string' }),
    db.removeColumn('customers', 'last_name'),
    db.removeColumn('customers', 'first_name')
  ]);
};

exports._meta = {
  version: 1
};
