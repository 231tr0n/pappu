import database from './database.js';

const models = {};

models.statuses = Object.freeze({
  holiday: 0,
  update: 1,
  no_update: -1
});

models.status_return_type = (update, holiday) => {
  this.update = update;
  this.holiday = holiday;
};

models.setup = async () => {
  await database.query(
    'CREATE TABLE IF NOT EXISTS `status_updates` (`date` TEXT NOT NULL UNIQUE DEFAULT (date()), `update` TEXT NOT NULL, `holiday` TEXT NOT NULL)'
  );
};

models.upsert_date = async (date) => {
  let results = null;
  if (date && Date.parse(date)) {
    results = database.query('SELECT * FROM `status_updates` WHERE date = ?', [
      date
    ]);
  } else {
    results = database.query(
      'SELECT * FROM `status_updates` WHERE date = (date())'
    );
  }
  if (results) {
    return;
  }
  if (date && Date.parse(date)) {
    await database.query('INSERT INTO `status_updates` (`date`) VALUES (?)', [
      date
    ]);
    return;
  }
  await database.query('INSERT INTO `status_updates` (`date`) VALUES (date())');
};

models.delete_date = async (date) => {
  if (date && Date.parse(date)) {
    await database.query('DELETE FROM `status_updates` WHERE `date` = ?', [
      date
    ]);
    return;
  }
  await database.query('DELETE FROM `status_updates` WHERE `date` = (date())');
};

models.upsert_status = async (id, status, date) => {
  if (date && Date.parse(date)) {
    await models.upsert_date(date);
    await database.query('UPDATE `status_updates` SET ? = ? WHERE date = ?', [
      id,
      status,
      date
    ]);
    return;
  }
  await models.upsert_date();
  await database.query(
    'UPDATE `status_updates` SET ? = ? WHERE date = (date())',
    [id, status]
  );
};

models.update_status = async (id, status, date) => {
  if (date && Date.parse(date)) {
    await database.query('UPDATE `status_updates` SET ? = ? WHERE date = ?', [
      id,
      status,
      date
    ]);
    return;
  }
  await database.query(
    'UPDATE `status_updates` SET ? = ? WHERE date = (date())',
    [id, status]
  );
};

models.get_statuses_on_date = async (date) => {
  let results = null;
  if (date && Date.parse(date)) {
    results = await database.query(
      'SELECT * FROM `status_updates` WHERE date = ?',
      [date]
    );
  }
  results = await database.query(
    'SELECT * FROM `status_updates` WHERE date = (date())'
  );
  let ret = null;
  if (results.length > 0) {
    ret = new models.status_return_type(
      results[0].update.split(','),
      results[0].holiday.split(',')
    );
  }
  return ret;
};

models.get_status_of_id_on_date = async (id, date) => {
  let results = null;
  if (date && Date.parse(date)) {
    results = await database.query(
      'SELECT * FROM `status_updates` WHERE date = ?',
      [id, date]
    );
  }
  results = await database.query(
    'SELECT ? FROM `status_updates` WHERE date = (date())',
    [id]
  );
  if (results.length > 0) {
    if (results[0].update.includes(id)) {
      return models.statuses.update;
    }
    if (results[0].holiday.includes(id)) {
      return models.statuses.holiday;
    }
  }
  return models.statuses.no_update;
};

export default models;
