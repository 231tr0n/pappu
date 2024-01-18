import database from './database.js';

const models = {};

models.split_character = ',';

models.statuses = Object.freeze({
  holiday: 0,
  update: 1,
  no_update: -1,
});

models.status_return_type = (update, holiday) => {
  if (!update || !holiday || !Array.isArray(update) || !Array.isArray(holiday)) {
    throw new Error('parameters are mandatory and should be arrays');
  }
  const ret = {};
  ret.update = update;
  ret.holiday = holiday;
  return ret;
};

models.setup = async () => {
  await database.query(
    'CREATE TABLE IF NOT EXISTS `status_updates` (`date` TEXT NOT NULL UNIQUE DEFAULT (date()), `update` TEXT NOT NULL DEFAULT "", `holiday` TEXT NOT NULL DEFAULT "")',
  );
};

models.insert_date = async (date) => {
  if (date && !Date.parse(date) && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('wrong date provided');
  }
  let results = null;
  if (date) {
    results = await database.query('SELECT * FROM `status_updates` WHERE date = ?', [
      date,
    ]);
  } else {
    results = await database.query(
      'SELECT * FROM `status_updates` WHERE date = (date())',
    );
  }
  if (results && results.length > 0) {
    return;
  }
  if (date) {
    await database.query('INSERT INTO `status_updates` (`date`) VALUES (?)', [
      date,
    ]);
    return;
  }
  await database.query('INSERT INTO `status_updates` (`date`) VALUES (date())');
};

models.delete_date = async (date) => {
  if (date && !Date.parse(date) && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('wrong date provided');
  }
  if (date) {
    await database.query('DELETE FROM `status_updates` WHERE `date` = ?', [
      date,
    ]);
    return;
  }
  await database.query('DELETE FROM `status_updates` WHERE `date` = (date())');
};

models.insert_status = async (id, status, date) => {
  if (date && !Date.parse(date) && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('wrong date provided');
  }
  if (status !== models.statuses.holiday && status !== models.statuses.update) {
    throw new Error('invalid status');
  }
  await models.insert_date(date);
  let res = null;
  if (date) {
    res = await models.get_status_of_id_on_date(id, date);
  } else {
    res = await models.get_status_of_id_on_date(id);
  }
  if (res === models.statuses.update || res === models.statuses.holiday) {
    return;
  }
  if (date) {
    res = await models.get_statuses_on_date(date);
  } else {
    res = await models.get_statuses_on_date();
  }
  if (status === models.statuses.update) {
    res.update.push(id);
  } else {
    res.holiday.push(id);
  }
  if (date) {
    await models.set_statuses_on_date(res, date);
    return;
  }
  await models.set_statuses_on_date(res);
};

models.upsert_status = async (id, status, date) => {
  if (date && !Date.parse(date) && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('wrong date provided');
  }
  if (status !== models.statuses.holiday && status !== models.statuses.update && status !== models.statuses.no_update) {
    throw new Error('invalid status');
  }
  await models.insert_date(date);
  let ret = null;
  if (date) {
    ret = await models.get_status_of_id_on_date(id, date);
  } else {
    ret = await models.get_status_of_id_on_date(id);
  }
  if (ret === status) {
    return;
  }
  if (date) {
    ret = await models.get_statuses_on_date(date);
  } else {
    ret = await models.get_statuses_on_date();
  }
  if (status === models.statuses.update) {
    ret.holiday = ret.holiday.filter((item) => item !== id);
    ret.update.push(id);
  } else if (status === models.statuses.holiday) {
    ret.update = ret.update.filter((item) => item !== id);
    ret.holiday.push(id);
  } else {
    ret.update = ret.update.filter((item) => item !== id);
    ret.holiday = ret.holiday.filter((item) => item !== id);
  }
  if (date) {
    await models.set_statuses_on_date(ret, date);
    return;
  }
  await models.set_statuses_on_date(ret);
};

models.set_statuses_on_date = async (statuses, date) => {
  if (date && !Date.parse(date) && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('wrong date provided');
  }
  if (!statuses || !statuses.update || !statuses.holiday || !Array.isArray(statuses.update) || !Array.isArray(statuses.holiday)) {
    throw new Error('wrong object provided');
  }
  if (date) {
    await models.delete_date(date);
    await database.query('INSERT INTO `status_updates` (`date`, `update`, `holiday`) VALUES (?, ?, ?)', [date, statuses.update.join(models.split_character), statuses.holiday.join(models.split_character)]);
    return;
  }
  await models.delete_date();
  await database.query('INSERT INTO `status_updates` (`date`, `update`, `holiday`) VALUES (date(), ?, ?)', [statuses.update.join(models.split_character), statuses.holiday.join(models.split_character)]);
};

models.get_statuses_on_date = async (date) => {
  if (date && !Date.parse(date) && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('wrong date provided');
  }
  let results = null;
  if (date) {
    results = await database.query(
      'SELECT * FROM `status_updates` WHERE date = ?',
      [date],
    );
  } else {
    results = await database.query(
      'SELECT * FROM `status_updates` WHERE date = (date())',
    );
  }
  let ret = null;
  if (results && results.length > 0) {
    ret = models.status_return_type(
      results[0].update.split(models.split_character),
      results[0].holiday.split(models.split_character),
    );
  }
  return ret;
};

models.get_status_of_id_on_date = async (id, date) => {
  if (date && !Date.parse(date) && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('wrong date provided');
  }
  let results = null;
  if (date) {
    results = await models.get_statuses_on_date(date);
  } else {
    results = await models.get_statuses_on_date(date);
  }
  if (results) {
    if (results.update.includes(id)) {
      return models.statuses.update;
    }
    if (results.holiday.includes(id)) {
      return models.statuses.holiday;
    }
  }
  return models.statuses.no_update;
};

export default models;
