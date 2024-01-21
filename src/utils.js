const utils = {};

utils.bot = {};
utils.bot.status_updates_channels = {};
utils.bot.admin_commands_channels = {};
utils.bot.logs_channels = {};

utils.bot.status_updates_channels.broadcast = async (message) => {
  for (const id of status_updates_channels) {
    await bot.channels.cache.get(id).send(message);
  }
};

utils.bot.admin_commands_channels.broadcast = async (message) => {
  for (const id of admin_commands_channels) {
    await bot.channels.cache.get(id).send(message);
  }
};

utils.bot.logs_channels.broadcast = async (message) => {
  for (const id of logs_channels) {
    await bot.channels.cache.get(id).send(message);
  }
};

utils.verify_date = (date) => {
  if (Date.parse(date) && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return true;
  }
  return false;
};

utils.verify_status = (status) => {
  if (status === "holiday" || status === "update" || status === "no_update") {
    return true;
  }
  return false;
};

export default utils;
