const database = require('./database');

const models = {};

models.query = (sql, params) => new Promise((resolve, reject) => {
  database.query({
    dateStrings: true,
    sql
  }, params).then((results) => {
    resolve(results);
  }).catch((error) => {
    reject(error);
  });
});

models.status_updates = {};
models.recruitment = {};
models.aliases = {};

models.status_updates.update_entry = async (id, update, date) => {
  if (date) {
    await models.query('DELETE FROM `status_updates` WHERE `id` = ? `AND` date = ?', [id, date]);
    await models.query('INSERT INTO `status_updates` (`date`, `id`, `update`) VALUES (?, ?, ?)', [date, id, update]);
  } else {
    await models.query('DELETE FROM `status_updates` WHERE `id` = ? AND `date` = curdate()', [id]);
    await models.query('INSERT INTO `status_updates` (`date`, `id`, `update`) VALUES (curdate(), ?, ?)', [id, update]);
  }
};

models.status_updates.get_entries = () => new Promise((resolve, reject) => {
  models.query('SELECT * FROM `status_updates`').then((results) => {
    resolve(results);
  }).catch((error) => {
    reject(error);
  });
});

models.status_updates.delete_entry = async (id, date) => {
  if (date) {
    await models.query('DELETE FROM `status_updates` WHERE `id` = ? AND `date` = ?', [id, date]);
  } else {
    await models.query('DELETE FROM `status_updates` WHERE `id` = ? AND `date` = curdate()', [id]);
  }
};

models.status_updates.insert_entry = async (id, update) => {
  const results = await models.query('SELECT * FROM `status_updates` WHERE `id` = ? AND `date` = curdate()', [id]);
  if (results.length == 0) {
    await models.query('INSERT INTO `status_updates` (`date`, `id`, `update`) VALUES (curdate(), ?, ?)', [id, update]);
  }
};

models.aliases.update_entry = async (id, alias) => {
  await models.query('DELETE FROM `aliases` WHERE `id` = ?', [id]);
  await models.query('INSERT INTO `aliases` (`id`, `alias`) VALUES (?, ?)', [id, alias]);
};

models.aliases.get_entries = () => new Promise((resolve, reject) => {
  models.query('SELECT * FROM `aliases`').then((results) => {
    resolve(results);
  }).catch((error) => {
    reject(error);
  });
});

models.recruitment.update_entry = async (id, git_repository, submission_data) => {
  await models.query('DELETE FROM `recruitment` WHERE `id` = ?', [id]);
  await models.query('INSERT INTO `recruitment` (`date`, `id`, `git_respository`, `submission_data`) VALUES (curdate(), ?, ?, ?)', [id, git_repository, submission_data]);
};

models.recruitment.get_entries = () => new Promise((resolve, reject) => {
  models.query('SELECT * FROM `recruitment`').then((results) => {
    resolve(results);
  }).catch((error) => {
    reject(error);
  });
});

module.exports = models;
