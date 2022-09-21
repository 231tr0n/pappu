const fs = require('node:fs');
const models = require('./models');

const utils = {};

utils.backup = async () => {
  const json = {};
  models.status_updates.get_entries().then((results) => {
    json.status_updates = results;
    return models.recruitment.get_entries();
  }).then((results) => {
    json.recruitment = results;
    return models.aliases.get_entries();
  }).then((results) => {
    json.aliases = results;
  });
  fs.rmSync(backup_file_name);
  fs.writeFileSync(backup_file_name, JSON.stringify(json, null, 4));
  return null;
};

utils.load_backup = async () => {
  if (fs.existsSync(backup_file_name)) {
    const json = fs.readFileSync(backup_file_name, 'utf-8');
    for (const i in json.status_updates) {
      await models.status_updates.update_entry(i.id, i.update, i.date);
    }
    for (const i in json.aliases) {
      await models.aliases.update_entry(i.id, i.alias);
    }
    for (const i in json.recruitment) {
      await models.recruitment.update_entry(i.id, i.git_repository, i.submission_data, i.date);
    }
  }
  return null;
};

utils.status_updates_channels.broadcast = async (message) => {
  for (const id of status_updates_channels) {
    await bot.channels.cache.get(id).send(message);
  }
};

utils.admin_commands_channels.broadcast = async (message) => {
  for (const id of admin_commands_channels) {
    await bot.channels.cache.get(id).send(message);
  }
};

utils.logs_channels.broadcast = async (message) => {
  for (const id of logs_channels) {
    await bot.channels.cache.get(id).send(message);
  }
};

module.exports = utils;
