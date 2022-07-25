require('dotenv').config();
const discord = require('discord.js');

global.db = {};
const sf = require('./helpers');
const commands = require('./commands');
require('./config');

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
		discord.GatewayIntentBits.GuildMembers
	]
});

bot.on('ready', async () => {
	if (!sf.load_backup()) {
		console.log('Backup File is corrupted. Please consult bot-devs once about this message.');
		console.log('If you want the bot to be working for now, please delete the "backup_data.json" file to get the bot to work.(Note: This will delete all your backup data!)');
		process.exit();
	} else {
		try {
			const guild = bot.guilds.cache.get(server_id);
			guild.members.fetch();
			if (bot.guilds.cache.get(server_id)) {
				for (const id of status_updates_channels) {
					bot.channels.cache.get(id).send('Hi. The Bot is online. I will be patrolling and monitoring you pretty closely. Don\'t try to evade status updates.');
				}
				for (const id of admin_commands_channels) {
					bot.channels.cache.get(id).send('The Bot is online.');
				}
				console.log(`Logged in as: ${bot.user.tag}`);
				// 				require('./timers'); // eslint-disable-line global-require
			} else {
				console.log('Server id you entered doesn\'t exist.');
				process.exit();
			}
		} catch (error) {
			console.log('One of the ids in admin_commands_channels and status_updates_channels don\'t exist.');
			process.exit();
		}
	}
});

bot.on('messageCreate', async (message) => {
	try {
		if (message.author.id != bot.user.id) {
			if (message?.guild?.id == server_id) {
				if (status_updates_channels.includes(message.channel.id) || admin_commands_channels.includes(message.channel.id)) {
					if (message.content.startsWith('$') || (message.content.startsWith('```') && message.content.endsWith('```'))) {
						if (!(message.content.startsWith('```') && message.content.endsWith('```'))) {
							if (message?.member) {
								console.log(message.member.displayName, ':', message.content);
							} else {
								console.log(message.author.username, ':', message.content);
							}
						} else {
							if (message?.member) {
								console.log(message.member.displayName, ': $status_update');
							}
							console.log(message.author.username, ': $status_update');
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
								case '$take_leave':
									commands.take_leave(message);
									break;
								case '$get_meeting_absentees_list':
									commands.get_meeting_absentees_list(message);
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
								case '$admin_help':
									commands.admin_help(message);
									break;
								case '$user_help':
									commands.user_help(message);
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
								case '$weekly_stats_all':
									commands.weekly_stats_all(message);
									break;
								case '$take_leave':
									commands.take_leave(message);
									break;
								case '$show_all_ids':
									commands.show_all_ids(message);
									break;
								case '$show_id':
									commands.show_id(message);
									break;
								case '$edit_user':
									commands.edit_user(message);
									break;
								case '$change_weekly_reset_day_number':
									commands.change_weekly_reset_day_number(message);
									break;
								case '$edit_id':
									commands.edit_id(message);
									break;
								case '$add_user':
									commands.add_user(message);
									break;
								case '$add_id':
									commands.add_id(message);
									break;
								case '$get_meeting_absentees_list':
									commands.get_meeting_absentees_list(message);
									break;
								case '$total_reset':
									commands.total_reset(message);
									break;
								case '$weekly_reset':
									commands.weekly_reset(message);
									break;
								case '$monthly_reset':
									commands.monthly_reset(message);
									break;
								case '$delete_user':
									commands.delete_user(message);
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
						}
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

bot.on('messageDelete', async (message) => {
	try {
		if (admin_commands_channels.includes(message.channel.id) || status_updates_channels.includes(message.channel.id)) {
			if (message.content.startsWith('```') && message.content.endsWith('```')) {
				const user = message.author;
				db[user.id].weekly_updates_count -= 1;
				db[user.id].monthly_updates_count -= 1;
				message.channel.send(`@everyone, <@${message.author.id}> is acting stupid and has deleted a status update message. Reducing 1 status update from <@${message.author.id}> entry.`);
				message.channel.send('**The following content has been deleted by his stupidity**');
				message.channel.send(message.content);
			} else if (message.content.startsWith('$')) {
				message.channel.send(`@everyone, <@${message.author.id}> is acting stupid and has deleted a bot command.`);
				message.channel.send('**The following command has been deleted by him**');
				message.channel.send(message.content);
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

bot.on('messageUpdate', async (old_message, message) => {
	try {
		if (admin_commands_channels.includes(old_message.channel.id) || status_updates_channels.includes(old_message.channel.id)) {
			if (old_message.content.startsWith('```') && old_message.content.endsWith('```')) {
				message.channel.send(`@everyone, <@${old_message.author.id}> has updated his status update message.`);
				message.channel.send(old_message.content);
				message.channel.send(message.content);
			} else if (old_message.content.startsWith('$')) {
				message.channel.send(`@everyone, <@${old_message.author.id}> has updated a bot command message.`);
				message.channel.send(`\`\`\`${old_message.content}\`\`\``);
				message.channel.send(`\`\`\`${message.content}\`\`\``);
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
