const fs = require('node:fs');
const models = require('./models');

const utils = {};

utils.status_updates_channels = {};
utils.admin_commands_channels = {};
utils.logs_channels = {};

utils.backup = async () => {
  const backup = {};
  let results = await models.status_updates.get_entries();
  backup.status_updates = results;
  results = await models.aliases.get_entries();
  backup.aliases = results;
  if (fs.existsSync(backup_file_name)) {
    fs.rmSync(backup_file_name);
  }
  fs.writeFileSync(backup_file_name, JSON.stringify(backup, null, 4));
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
  }
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
