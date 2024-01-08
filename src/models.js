import database from './database.js';

const models = {};

models.statuses = Object.freeze({
  holiday: 0,
  update: 1,
  no_update: -1,
});

models.status_return_type = (update, holiday) => {
  if (!update || !holiday || !Array.isArray(update) || !Array.isArray(update)) {
    throw new Error('parameters are mandatory and should be arrays');
  }
  this.update = update;
  this.holiday = holiday;
};

models.setup = async () => {
  await database.query(
    'CREATE TABLE IF NOT EXISTS `status_updates` (`date` TEXT NOT NULL UNIQUE DEFAULT (date()), `update` TEXT NOT NULL, `holiday` TEXT NOT NULL)',
  );
};

models.insert_date = async (date) => {
  if (date && !Date.parse(date)) {
    throw new Error('wrong date provided');
  }
  let results = null;
  if (date) {
    results = database.query('SELECT * FROM `status_updates` WHERE date = ?', [
      date,
    ]);
  } else {
    results = database.query(
      'SELECT * FROM `status_updates` WHERE date = (date())',
    );
  }
  if (results) {
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
  if (date && Date.parse(date)) {
    await database.query('DELETE FROM `status_updates` WHERE `date` = ?', [
      date,
    ]);
    return;
  }
  await database.query('DELETE FROM `status_updates` WHERE `date` = (date())');
};

models.insert_status = async (id, status, date) => {
  if (date && !Date.parse(date)) {
    throw new Error('wrong date provided');
  }
  if (status !== models.statuses.holiday || status !== models.statuses.update) {
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
    res.update += `,${id}`;
  } else {
    res.holiday += `,${id}`;
  }
  if (date) {
    await models.set_statuses_on_date(res, date);
    return;
  }
  await models.set_statuses_on_date(res);
};

models.upsert_status = async (id, status, date) => {
  if (date && !Date.parse(date)) {
    throw new Error('wrong date provided');
  }
  if (status !== models.statuses.holiday || status !== models.statuses.update !== models.statuses.no_update) {
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
    ret.holiday = ret.holiday.split(',').filter((item) => item !== id).join(',');
    ret.update += `,${id}`;
  } else if (status === models.statuses.holiday) {
    ret.update = ret.update.split(',').filter((item) => item !== id).join(',');
    ret.holiday += `,${id}`;
  } else {
    ret.update = ret.update.split(',').filter((item) => item !== id).join(',');
    ret.holiday = ret.holiday.split(',').filter((item) => item !== id).join(',');
  }
  if (date) {
    await models.set_statuses_on_date(ret, date);
    return;
  }
  await models.set_statuses_on_date(ret);
};

models.set_statuses_on_date = async (statuses, date) => {
  if (date && !Date.parse(date)) {
    throw new Error('wrong date provided');
  }
  if (!statuses || !statuses.update || !statuses.holiday || !Array.isArray(statuses.update) || !Array.isArray(statuses.holiday)) {
    throw new Error('wrong object provided');
  }
  if (date) {
    await models.delete_date(date);
    await database.query('INSERT INTO `status_updates` (`date`, `update`, `holiday`) VALUES (?, ?, ?)', [date, statuses.update.join(','), statuses.holiday.join(',')]);
    return;
  }
  await models.delete_date();
  await database.query('INSERT INTO `status_updates` (`date`, `update`, `holiday`) VALUES (date(), ?, ?)', [statuses.update.join(','), statuses.holiday.join(',')]);
};

models.get_statuses_on_date = async (date) => {
  if (date && !Date.parse(date)) {
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
  if (results.length > 0) {
    ret = new models.status_return_type(
      results[0].update.split(','),
      results[0].holiday.split(','),
    );
  }
  return ret;
};

models.get_status_of_id_on_date = async (id, date) => {
  if (date && !Date.parse(date)) {
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
