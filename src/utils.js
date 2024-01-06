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

export default utils;
