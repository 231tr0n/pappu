const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.db_host,
  user: process.env.db_username,
  password: process.env.db_password,
  database: process.env.db_name,
  connectionLimit: 9
});

const database = {};

database.query = (...args) => new Promise((resolve, reject) => {
  pool.query(...args).then((results) => {
    resolve(results);
  }).catch((error) => {
    reject(error);
  });
});

database.end = () => new Promise((resolve, reject) => {
  pool.end().then(() => {
    resolve();
  }).catch((error) => {
    reject(error);
  });
});

module.exports = database;
