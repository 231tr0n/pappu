import sqlite from 'sqlite3';

const db = new sqlite.Database('pappu.db');

const database = {};

database.query = (...args) => new Promise((resolve, reject) => {
  db.all(...args, (error, rows) => {
    if (error) {
      reject(error);
    }
    resolve(rows);
  });
});

database.close = () => new Promise((resolve, reject) => {
  db.close((error) => {
    if (error) {
      reject(error);
    }
    resolve();
  });
});

export default database;
