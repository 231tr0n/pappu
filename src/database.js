import sqlite from "sqlite3";

const db = new sqlite.Database("pappu.db");

const database = {};

database.query = (...args) =>
  new Promise((resolve) => {
    db.all(...args, (error, rows) => {
      if (error) {
        throw error;
      }
      resolve(rows);
    });
  });

database.close = () =>
  new Promise((resolve) => {
    db.close((error) => {
      if (error) {
        throw error;
      }
      resolve();
    });
  });

export default database;
