/* jshint esnext: true */

// Provides an interface for persisting and querying the database.

import pgp from 'pg-promise';

var DEFAULT_SETTINGS = {
  'host': 'postgres',
  'database': 'postgres',
  'user': 'postgres'
};

var db;
var init = function (settings) {
  db = pgp(settings);
};

var update = function (statement, values) {
  return db.none(statement, values);
};

var query = function (query, values) {
  return db.any(query, values);
};

export default {
  DEFAULT_SETTINGS: DEFAULT_SETTINGS,
  init: init,
  update: update,
  query: query
};
