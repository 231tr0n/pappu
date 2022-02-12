require('dotenv').config();
const discord = require('discord.js');
global.db = {};
const sf = require('./helpers');
const commands = require('./commands');
require('./config');

const bot = new discord.Client({
	intents: [
		discord.Intents.FLAGS.GUILDS,
		discord.Intents.FLAGS.GUILD_VOICE_STATES,
		discord.Intents.FLAGS.GUILD_MESSAGES,
		discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		discord.Intents.FLAGS.DIRECT_MESSAGES,
		discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
		discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
	]
});

bot.on('ready', () => {
	if (!sf.load_backup()) {
		console.log('Backup File is corrupted. Please consult bot-devs once about this message.');
		console.log('If you want the bot to be working for now, please delete the "backup_data.json" file to get the bot to work.(Note: This will delete all your backup data!)');
		process.exit();
	} else {
		console.log(`Logged in as: ${bot.user.tag}`);
	}
});

bot.on('messageCreate', (message) => {
	try {
		if (message?.guild?.id) {
			if (message.guild.id == server_id) {
				if (message.content[0] === '$' || (message.content.startsWith('```') && message.content.endsWith('```'))) {
					if (message?.member) {
						console.log(message.member.displayName, ': ', message.content);
					} else {
						console.log(message.author.username, ': ', message.content);
					}
					if (status_updates_channels.includes(message.channel.id)) {
						message.react(attended_character);
						if (message.content.startsWith('```')) {
							commands.status_update(message);
						} else {
							const split_message = message.content.split(' ');
							switch (split_message[0]) {
								case '$ping':
									commands.ping(message);
									break;
								case '$version':
									commands.version(message);
									break;
								case '$help':
									commands.user_help(message);
									break;
								case '$stats':
									commands.stats(message);
									break;
								case '$update_nickname':
									commands.update_nickname(message);
									break;
								case '$weekly_stats_all':
									commands.weekly_stats_all(message);
									break;
								default:
									message.react(fail_character);
									message.reply('Are you stupid. Stop speaking the language which I dont understand.');
									break;
							}
						}
					} else if (admin_commands_channels.includes(message.channel.id)) {
						message.react(attended_character);
						if (message.content.startsWith('```')) {
							commands.status_update(message);
						} else {
							const split_message = message.content.split(' ');
							switch (split_message[0]) {
								case '$ping':
									commands.ping(message);
									break;
								case '$version':
									commands.version(message);
									break;
								case '$help':
									commands.admin_help(message);
									break;
								case '$update_nickname':
									commands.update_nickname(message);
									break;
								case '$update_nickname_with_id':
									commands.update_nickname_with_id(message);
									break;
								case '$stats':
									commands.stats(message);
									break;
								case '$stats_all':
									commands.stats_all(message);
									break;
								case '$show_all_entries':
									commands.show_all_entries(message);
									break;
								case '$show_entry':
									commands.show_entry(message);
									break;
								case '$subtract':
									commands.subtract(message);
									break;
								case '$add':
									commands.add(message);
									break;
								case '$add_user':
									commands.add_user(message);
									break;
								case '$reset':
									commands.reset(message);
									break;
								case '$delete':
									commands.delete_entry(message);
									break;
								case '$delete_all':
									commands.delete_all(message);
									break;
								case '$delete_id':
									commands.delete_id(message);
									break;
								case '$backup':
									commands.backup(message);
									break;
								case '$load_backup':
									commands.load_backup(message);
									break;
								case '$delete_backup':
									commands.delete_backup(message);
									break;
								case '$shutdown':
									commands.shutdown(message);
									break;
								default:
									message.react(fail_character);
									message.reply('Are you stupid. Stop speaking the language which I dont understand.');
									break;
							}
						}
					} else {
						message.react(not_attended_character);
						message.reply('Are you stupid, bot doesn\'t listen to messages in other channels.');
					}
				}
			}
		}
	} catch (error) {
		console.log('-------------------------------------------------------');
		console.log(error);
		console.log('-------------------------------------------------------');
		message.react(repair_character);
		message.reply('Bot\'s brain screw has become loose. Error occured with the bot. Please consult the bot-dev once about this message.');
	}
});

bot.on('messageDelete', (message) => {
	try {
		if (admin_commands_channels.includes(message.channel.id) || status_updates_channels.includes(message.channel.id)) {
			if (message.content.startsWith('```') && message.content.endsWith('```')) {
				db.
				message.channel.send(`@everyone, <@${message.author.id}> is acting stupid and has deleted a status update message. Reducing 1 from <@${message.author.id}> entry.`);
				message.channel.send('**The following content has been deleted by his stupidity**', message.content);
			}
		}
	} catch (error) {
		console.log('-------------------------------------------------------');
		console.log(error);
		console.log('-------------------------------------------------------');
		message.react(repair_character);
		message.reply('Bot\'s brain screw has become loose. Error occured with the bot. Please consult the bot-dev once about this message.');
	}
});

bot.login(process.env.CLIENT_TOKEN);
