import database from './database.js';

const models = {};

models.statuses = Object.freeze({
  holiday: 0,
  update: 1,
  no_update: -1
});

models.setup = async () => {
  await database.query('CREATE TABLE IF NOT EXISTS `status_updates` (`date` VARCHAR(100) NOT NULL UNIQUE DEFAULT (date()))');
};

models.upsert_id = async (id) => {
  const results = await database.query('SELECT ? FROM `status_updates` LIMIT 1', [id]);
  if (results.length > 0) {
    return;
  }
  await database.query('ALTER TABLE `status_updates` ADD COLUMN IF NOT EXISTS ? INT NOT NULL DEFAULT ?', [id, models.statuses.no_update]);
};

models.delete_id = async (id) => {
  await database.query('ALTER TABLE `status_updates` DROP COLUMN IF EXISTS ?', [id]);
};

models.upsert_date = async (date) => {
  let results = null;
  if (date && Date.parse(date)) {
    results = database.query('SELECT * FROM `status_updates` WHERE date = ?', [date]);
  } else {
    results = database.query('SELECT * FROM `status_updates` WHERE date = (date())');
  }
  if (results) {
    return;
  }
  if (date && Date.parse(date)) {
    await database.query('INSERT INTO `status_updates` (`date`) VALUES (?)', [date]);
    return;
  }
  await database.query('INSERT INTO `status_updates` (`date`) VALUES (date())');
};

models.delete_date = async (date) => {
  if (date && Date.parse(date)) {
    await database.query('DELETE FROM `status_updates` WHERE `date` = ?', [date]);
    return;
  }
  await database.query('DELETE FROM `status_updates` WHERE `date` = (date())');
};

models.upsert_status = async (id, status, date) => {
  if (date && Date.parse(date)) {
    await Promise.all([
      models.upsert_id(id),
      models.upsert_date(date)
    ]);
    await database.query('UPDATE `status_updates` SET ? = ? WHERE date = ?', [id, status, date]);
    return;
  }
  await Promise.all([
    models.upsert_id(id),
    models.upsert_date()
  ]);
  await database.query('UPDATE `status_updates` SET ? = ? WHERE date = (date())', [id, status]);
};

models.update_status = async (id, status, date) => {
  if (date && Date.parse(date)) {
    await database.query('UPDATE `status_updates` SET ? = ? WHERE date = ?', [id, status, date]);
    return;
  }
  await database.query('UPDATE `status_updates` SET ? = ? WHERE date = (date())', [id, status]);
};

models.get_statuses_on_date = async (date) => {
  if (date && Date.parse(date)) {
    return database.query('SELECT * FROM `status_updates` WHERE date = ?', [date]);
  }
  return database.query('SELECT * FROM `status_updates` WHERE date = (date())');
};

models.get_statuses_of_id = async (id) => database.query('SELECT ? FROM `status_updates`', [id]);

models.get_status_of_id_on_date = async (id, date) => {
  if (date && Date.parse(date)) {
    return database.query('SELECT ? FROM `status_updates` WHERE date = ?', [id, date]);
  }
  return database.query('SELECT ? FROM `status_updates` WHERE date = (date())', [id]);
};

export default models;
