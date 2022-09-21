require('./config');
const discord = require('discord.js');
const utils = require('./utils');
const models = require('./models');
const commands = require('./commands');

global.bot = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildVoiceStates,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.GuildMessageReactions,
    discord.GatewayIntentBits.DirectMessages,
    discord.GatewayIntentBits.DirectMessageReactions,
    discord.GatewayIntentBits.GuildEmojisAndStickers,
    discord.GatewayIntentBits.GuildMessageTyping,
    discord.GatewayIntentBits.DirectMessageTyping,
    discord.GatewayIntentBits.GuildPresences,
    discord.GatewayIntentBits.GuildMembers,
    discord.GatewayIntentBits.MessageContent,
    discord.GatewayIntentBits.GuildInvites,
    discord.GatewayIntentBits.GuildScheduledEvents,
    discord.GatewayIntentBits.GuildWebhooks,
    discord.GatewayIntentBits.GuildBans,
    discord.GatewayIntentBits.GuildIntegrations
  ]
});

bot.on('ready', async () => {
  await (async () => {
    try {
      await Promise.all([
        models.query('CREATE TABLE IF NOT EXISTS `status_updates` (`date` DATE, `id` VARCHAR(100) NOT NULL, `update` INT NOT NULL)'),
        models.query('CREATE TABLE IF NOT EXISTS `recruitment` (`date` DATE, `id` VARCHAR(100) NOT NULL, `git_repository` VARCHAR(100) NOT NULL, `submission_data` VARCHAR(10000) NOT NULL)'),
        models.query('CREATE TABLE IF NOT EXISTS aliases (`id` VARCHAR(100) NOT NULL, `alias` VARCHAR(100) NOT NULL)')
      ]);
      await utils.load_backup();
    } catch (error) {
      console.log(error);
      process.exit();
    }
  })();
  try {
    const guild = bot.guilds.cache.get(server_id);
    await guild.members.fetch();
    await guild.channels.fetch();
    if (bot.guilds.cache.get(server_id)) {
      await utils.status_updates_channels.broadcast('Hi. The Bot is online. I will be patrolling and monitoring you pretty closely. Don\'t try to evade status updates.');
      await utils.admin_commands_channels.broadcast('The Bot is online.');
      await utils.logs_channels.broadcast('The Bot is online.');
      console.log(`Logged in as: ${bot.user.tag}`);
    } else {
      console.log('Server id you entered doesn\'t exist.');
      process.exit();
    }
  } catch (error) {
    console.log('One of the ids in admin_commands_channels, logs_channels or status_updates_channels don\'t exist.');
    process.exit();
  }
});

bot.on('messageCreate', async (message) => {
  try {
    if (message.author.id != bot.user.id && message?.guild?.id == server_id) {
      if (status_updates_channels.includes(message.channel.id)) {
        message.react(attended_character);
        if (message.content.startsWith('```') && message.content.endsWith('```')) {
          await utils.logs_channels.broadcast(`${message.id} # ${message.channel.id} # ${message.author.id}: ${message.content}`);
          commands.status_update.handler(message);
        } else if (message.content.startsWith('$')) {
          await utils.logs_channels.broadcast(`${message.id} # ${message.channel.id} # ${message.author.id}: ${message.content}`);
          const split_message = message.content.split(' ');
          const command = split_message[0].slice(1);
          if (commands[command]) {
            if (commands[command].type.includes('user')) {
              commands[command].handler(message);
            } else {
              message.react(fail_character);
              message.reply('Are you stupid. Stop speaking the language which I dont understand.');
            }
          } else {
            message.react(fail_character);
            message.reply('Are you stupid. Stop speaking the language which I dont understand.');
          }
        }
      } else if (admin_commands_channels.includes(message.channel.id)) {
        message.react(attended_character);
        if (message.content.startsWith('```') && message.content.endsWith('```')) {
          await utils.logs_channels.broadcast(`${message.id} # ${message.channel.id} # ${message.author.id}: ${message.content}`);
          commands.query.handler(message);
        } else if (message.content.startsWith('$')) {
          await utils.logs_channels.broadcast(`${message.id} # ${message.channel.id} # ${message.author.id}: ${message.content}`);
          const split_message = message.content.split(' ');
          const command = split_message[0].slice(1);
          if (commands[command]) {
            if (commands[command].type.includes('admin')) {
              commands[command].handler(message);
            } else {
              message.react(fail_character);
              message.reply('Are you stupid. Stop speaking the language which I dont understand.');
            }
          } else {
            message.react(fail_character);
            message.reply('Are you stupid. Stop speaking the language which I dont understand.');
          }
        }
      }
    }
  } catch (error) {
    try {
      await utils.logs_channels.broadcast(`@everyone, ${message.id} # ${message.channel.id} # ${message.author.id}: ${message.content}\n\`\`\`${error.toString()}\`\`\``);
      message.react(repair_character);
      message.reply('Bot\'s brain screw has become loose. Error occured with the bot. Please consult the bot-devs once about this message.');
    } catch (err) {
      console.log(err);
    }
  }
});

bot.on('messageDelete', async (message) => {
  try {
    if (admin_commands_channels.includes(message.channel.id) || status_updates_channels.includes(message.channel.id)) {
      if (message.content.startsWith('```') && message.content.endsWith('```')) {
        const message_date = message.createdAt;
        models.status_updates.delete_entry(message.author.id, `${message_date.getFullYear().toString()}-${(message_date.getMonth() + 1).toString()}-${message_date.getDate().toString()}`);
        await utils.logs_channels.broadcast(`@everyone, ${message.author.id} is acting stupid and has deleted a status update message. Reducing 1 status update from his entry.`);
        await utils.logs_channels.broadcast('**The following content has been deleted by his stupidity**');
        await utils.logs_channels.broadcast(message.content);
      } else if (message.content.startsWith('$')) {
        await utils.logs_channels.broadcast(`@everyone, ${message.author.id} is acting stupid and has deleted a status update message. Reducing 1 status update from his entry.`);
        await utils.logs_channels.broadcast('**The following content has been deleted by his stupidity**');
        await utils.logs_channels.broadcast(`\`\`\`${message.content}\`\`\``);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

bot.on('messageUpdate', async (old_message, message) => {
  try {
    if (admin_commands_channels.includes(old_message.channel.id) || status_updates_channels.includes(old_message.channel.id)) {
      if (old_message.content.startsWith('```') && old_message.content.endsWith('```')) {
        await utils.logs_channels.broadcast(`@everyone, ${old_message.author.id} has updated his status update message.`);
        await utils.logs_channels.broadcast(old_message.content);
        await utils.logs_channels.broadcast(message.content);
      } else if (old_message.content.startsWith('$')) {
        await utils.logs_channels.broadcast(`@everyone, ${old_message.author.id} has updated a bot command message.`);
        await utils.logs_channels.broadcast(`\`\`\`${old_message.content}\`\`\``);
        await utils.logs_channels.broadcast(`\`\`\`${message.content}\`\`\``);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

bot.login(process.env.client_token);
