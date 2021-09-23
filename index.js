require('dotenv').config();
const discord = require('discord.js');
const commands = require('./commands.js');
const global_variables = require('./global_variables.js');
const support_functions = require('./support_functions.js');

const bot = new discord.Client();

bot.on('ready', () => {
	if (!support_functions.load_backup()) {
		console.log("Backup File is corrupted. Please contact bot-dev once about this message.");
		console.log('If you want the bot to be working for now, please delete the "backup_data.json" file to get the bot to work.(Note: This will delete all your backup data!)');
		process.exit();
	} else {
		console.log("Logged in as: " + bot.user.tag);
	}
});

bot.on('message', (message) => {
	try {
		if (message.guild && message.guild.id) {
			if (message.guild.id == global_variables.server_id) {
				if (message.content[0] === '$') {
					console.log(global_variables.hash_map);
					if (message.member) {
						console.log(message.member.displayName, ': ', message.content);
					} else {
						console.log(message.author.username, ': ', message.content);
					}
					let split_message = message.content.split(' ');
					if (message.channel.id == global_variables.status_updates_channel) {
						message.react(global_variables.attended_character);
						switch (split_message[0]) {
							case '$ping':
								commands.command_ping(message);
								break;
							case '$version':
								commands.command_version(message);
								break;
							case '$help':
								commands.command_user_help(message);
								break;
							case '$status_update':
								commands.command_status_update(message);
								break;
							case '$stats':
								commands.command_stats(message);
								break;
							case '$update_nickname':
								commands.command_update_nickname(message);
								break;
							case '$stats_all':
								commands.command_stats_all(message);
								break;
							default:
								message.reply('Are you stupid. Stop speaking the language which I dont understand.');
								break;
						}
					} else if (message.channel.id == global_variables.admin_commands_channel) {
						message.react(global_variables.attended_character);
						switch (split_message[0]) {
							case '$ping':
								commands.command_ping(message);
								break;
							case '$version':
								commands.command_version(message);
								break;
							case '$help':
								commands.command_admin_help(message);
								break;
							case '$update_nickname':
								commands.command_update_nickname(message);
								break;
							case '$update_nickname_with_id':
								commands.command_update_nickname_with_id(message);
								break;
							case '$status_update':
								commands.command_status_update(message);
								break;
							case '$stats':
								commands.command_stats(message);
								break;
							case '$stats_all':
								commands.command_stats_all(message);
								break;
							case '$show_all_entries':
								commands.command_show_all_entries(message);
								break;
							case '$show_entry':
								commands.command_show_entry(message);
								break;
							case '$subtract':
								commands.command_subtract(message);
								break;
							case '$add':
								commands.command_add(message);
								break;
							case '$add_user':
								commands.command_add_user(message);
								break;
							case '$reset':
								commands.command_reset(message);
								break;
							case '$delete':
								commands.command_delete(message);
								break;
							case '$delete_all':
								commands.command_delete_all(message);
								break;
							case '$delete_id':
								commands.command_delete_id(message);
								break;
							case '$backup':
								commands.command_backup(message);
								break;
							case '$load_backup':
								commands.command_load_backup(message);
								break;
							case '$delete_backup':
								commands.command_delete_backup(message);
								break;
							case '$shutdown':
								commands.command_shutdown(message);
								break;
							default:
								message.reply('Are you stupid. Stop speaking the language which I dont understand.');
								break;
						}
					} else {
						message.react(global_variables.not_attended_character);
						message.reply('Bot doesn\'t listen to messages in other channels.');
					}
				}
			}
		}
	} catch (error) {
		console.log('-------------------------------------------------------');
		console.log(error);
		console.log('-------------------------------------------------------');
		message.react(global_variables.fail_character);
		message.reply('Error occured with the bot. Please consult the bot-dev once about this message.');
	}
});

bot.login(process.env.CLIENT_TOKEN);
