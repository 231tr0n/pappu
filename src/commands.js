import database from './database.js';
import models from './models.js';

const commands = {};

commands.ping = {
  type: ['user', 'admin'],
  description: 'Shows ping',
  handler: async (message) => {
    message.reply(`${Math.round(bot.ws.ping)}ms pong.`);
    message.react(done_character);
  },
};

commands.help = {
  type: ['user', 'admin'],
  description: 'Shows help',
  handler: async (message) => {
    let temp = '```';
    for (const i in commands) {
      if (status_updates_channels.includes(message.channel.id)) {
        if (commands[i].type.includes('user')) {
          temp += `${i}: ${commands[i].description}\n`;
        }
      } else if (admin_commands_channels.includes(message.channel.id)) {
        if (commands[i].type.includes('admin')) {
          temp += `${i}: ${commands[i].description}\n`;
        }
      }
    }
    temp += '```';
    message.reply(temp);
    message.react(done_character);
  },
};

commands.status_update = {
  type: ['user'],
  description: 'Puts status update',
  handler: async (message) => {
    await models.insert_status(message.author.id, models.statuses.update);
    message.react(done_character);
  },
};

commands.take_holiday = {
  type: ['user'],
  description: 'Puts holiday',
  handler: async (message) => {
    await models.insert_status(message.author.id, models.statuses.holiday);
    message.react(done_character);
  },
};

commands.query = {
  type: ['admin'],
  description: 'Lets you execute a query in the database',
  handler: async (message) => {
    let message_content = message.content.replaceAll('```', '');
    if (message_content.split(' ')[0] === `${bot_command_initiator}query`) {
      message_content = message_content.split(' ').slice(1).join(' ');
    }
    database
      .query(message_content)
      .then((results) => {
        message.reply(`\`\`\`${JSON.stringify(results, null, 4)}\`\`\``);
        message.react(done_character);
      })
      .catch((error) => {
        message.reply(`\`\`\`${JSON.stringify(error, null, 4)}\`\`\``);
        message.react(fail_character);
      });
  },
};

commands.modify_update = {
  type: ['admin'],
  description: "Updates a user's status update ([@user], [status(update|no_update|holiday)] [date(yyyy-mm-dd)(optional)])",
  handler: async (message) => {
    const params = message.content.split(' ');
    if (
      params.length < 3
      || params[2] !== 'holiday'
      || params[2] !== 'update'
      || params[2] !== 'no_update'
      || message.mentions.members.length !== 1
    ) {
      message.reply('wrong parameters passed');
      message.react(fail_character);
      return;
    }
    if (params.length > 3 && !Date.parse(params[3]) && /^\d{4}-\d{2}-\d{2}$/.test(params[3])) {
      message.reply('wrong date format passed');
      message.react(fail_character);
      return;
    }
    if (params[2] === 'holiday') {
      if (params.length > 3) {
        await models.upsert_status(message.mentions.members[0].id, models.statuses.holiday, params[3]);
        message.react(done_character);
        return;
      }
      await models.upsert_status(message.mentions.members[0].id, models.statuses.holiday);
      message.react(done_character);
      return;
    }
    if (params[2] === 'update') {
      if (params.length > 3) {
        await models.upsert_status(message.mentions.members[0].id, models.statuses.update, params[3]);
        message.react(done_character);
        return;
      }
      await models.upsert_status(message.mentions.members[0].id, models.statuses.update);
      message.react(done_character);
      return;
    }
    if (params.length > 3) {
      await models.upsert_status(message.mentions.members[0].id, models.statuses.no_update, params[3]);
      message.react(done_character);
      return;
    }
    await models.upsert_status(message.mentions.members[0].id, models.statuses.no_update);
    message.react(done_character);
  },
};

commands.get_updates = {
  type: ['user', 'admin'],
  description:
    'Prints all status updates in a given duration ([start_date(yyyy-mm-dd)] [end_date(yyyy-mm-dd)(optional)])',
  handler: async (message) => {
    const params = message.content.split(' ');
    let start_date = null;
    let end_date = null;
    if (params.length < 2) {
      message.reply('wrong parameters passed');
      message.react(fail_character);
      return;
    }
    if (params.length === 2 && Date.parse(params[1]) && /^\d{4}-\d{2}-\d{2}$/.test(params[1])) {
      start_date = new Date(params[1]);
      end_date = new Date();
    } else if (
      params.length > 2
      && Date.parse(params[1])
      && /^\d{4}-\d{2}-\d{2}$/.test(params[1])
      && Date.parse(params[2])
      && /^\d{4}-\d{2}-\d{2}$/.test(params[1])
    ) {
      start_date = new Date(params[1]);
      end_date = new Date(params[2]);
    } else {
      message.reply('wrong date format');
      message.react(fail_character);
      return;
    }
    let loop = new Date(start_date);
    const results = [];
    while (loop <= end_date) {
      results.push(await models.get_statuses_on_date(loop));
      loop = new Date(loop.setDate(loop.getDate() + 1));
    }
    message.reply(`\`\`\`${results}\`\`\``);
    message.react(done_character);
  },
};

commands.shutdown = {
  type: ['admin'],
  description: 'Shuts down the bot',
  handler: async (message) => {
    await message.react(done_character);
    process.kill(process.pid, 'SIGTERM');
  },
};

export default commands;
