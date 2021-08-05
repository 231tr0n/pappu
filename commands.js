const support_functions = require('./support_functions.js');
const global_variables = require('./global_variables.js');

let command_ping = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		message.reply('pong.');
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_admin_help = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		message.channel.send('```"$" is the key letter for the bot commands.\n"$ping" is to check whether the bot is functioning or not.\n"$help" is for getting a list of commands for the bot.\n"$status_update" should be typed before your status updates so that it gets recorded by the bot.\n"$stats [@mention(optional)]" should be typed by the user who wants to see their stats regarding their status updates.\n"$stats_all" should be typed to get the stats of all the user\'s status updates.\n"$subtract [Integer] [@mention(optional)]" is used to deduct the number specified to their status updates count.\n"$add [Integer] [@mention(optional)]" is used to add the number specified to their status updates count.\n"$reset" is used to reset all the stats to 0.\n"$delete [@mention(optional)]" is used to delete the entry of a user.\n"$delete_all" will delete the entries of all the users.\n"$backup" will write the present Map object to a file accessible on the server-side.\n"$load_backup" loads the data in the backup file.\n"$shutdown" shutdowns the bot.```');
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_user_help = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		message.channel.send('```"$" is the key letter for the bot commands.\n"$ping" is to check whether the bot is functioning or not.\n"$help" is for getting a list of commands for the bot.\n"$status_update" should be typed before your status updates so that it gets recorded by the bot.\n"$stats [@mention(optional)]" should be typed by the user who wants to see their stats regarding their status updates.\n"$stats_all" should be typed to get the stats of all the user\'s status updates.```');
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_status_update = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		if (global_variables.hash_map.has(message.author.username)) {
			if (global_variables.hash_map.get(message.author.username) >= global_variables.max_status_updates_limit) {
				message.reply('Are you stupid. How can you put more than ' + global_variables.max_status_updates_limit.toString() + ' status updates.');
			} else {
				global_variables.hash_map.set(message.author.username, (global_variables.hash_map.get(message.author.username) + 1));
				message.reply('Recorded your status update.');
			}
		} else {
			global_variables.hash_map.set(message.author.username, 1);
			global_variables.name_map.set(message.author.username, message.member.displayName);
			message.reply('Created a entry for your username.');
			message.reply('Recorded your status update.');
		}
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_stats_all = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		if (global_variables.hash_map.size == 0) {
			message.reply('No entries recorded.');
		} else {
			let reply_message = '';
			for (let [key, value] of global_variables.hash_map.entries()) {
				for (let i = 0; i < value; i ++) {
					reply_message += global_variables.status_update_character;
				}
				if (global_variables.max_status_updates_limit >= value) {
					for (let i = 0; i < (global_variables.max_status_updates_limit - value); i ++) {
						reply_message += global_variables.no_status_update_character;
					}
				}
				reply_message += ' ' + global_variables.arrow_character + ' ' + global_variables.name_map.get(key) + global_variables.value_differentiating_character + ' ' + value + '\n';
			}
			message.channel.send('```' + reply_message + '```');
		}
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_stats = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1 || split_message.length == 2) {
		if (global_variables.hash_map.size == 0) {
			message.reply('No entries recorded.');
		} else {
			let reply_message = '';
			if (message.mentions.users.first() === undefined) {
				if (global_variables.hash_map.has(message.author.username)) {
					let temp = global_variables.hash_map.get(message.author.username);
					for (let i = 0; i < temp; i ++) {
						reply_message += global_variables.status_update_character;
					}
					if (global_variables.max_status_updates_limit >= temp) {
						for (let i = 0; i < (global_variables.max_status_updates_limit - temp); i ++) {
							reply_message += global_variables.no_status_update_character;
						}
					}
					reply_message += ' ' + global_variables.arrow_character + ' ' + global_variables.name_map.get(message.author.username) + global_variables.value_differentiating_character + ' ' + temp;
					message.reply('```' + reply_message + '```');
				} else {
					message.reply('No record of you found.');
				}
			} else {
				if (global_variables.hash_map.has(message.mentions.users.first().username)) {
					let temp = global_variables.hash_map.get(message.mentions.users.first().username);
					for (let i = 0; i < temp; i ++) {
						reply_message += global_variables.status_update_character;
					}
					if (global_variables.max_status_updates_limit >= temp) {
						for (let i = 0; i < (global_variables.max_status_updates_limit - temp); i ++) {
							reply_message += global_variables.no_status_update_character;
						}
					}
					reply_message += ' ' + global_variables.arrow_character + ' ' + global_variables.name_map.get(message.mentions.users.first().username) + global_variables.value_differentiating_character + ' ' + temp;
					message.reply('```' + reply_message + '```');
				} else {
					message.reply(`No record for <@${message.mentions.users.first().id}> found.`);
				}
			}
		}
	} else {
		message.reply('Command accept only 1 arguments.');
	}
}

let command_subtract = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 2 || split_message.length == 3) {
		if (!isNaN(parseInt(split_message[1]))) {
			if (parseInt(split_message[1]) > 0 && parseInt(split_message[1]) <= global_variables.max_status_updates_limit) {
				if (message.mentions.users.first() === undefined) {
					if (global_variables.hash_map.has(message.author.username)) {
						global_variables.hash_map.set(message.author.username, global_variables.hash_map.get(message.author.username) - parseInt(split_message[1]));
						if (global_variables.hash_map.get(message.author.username) < 0) {
							global_variables.hash_map.set(message.author.username, 0);
						}
						message.reply('Subtracted the number given from your record.');
					} else {
						message.reply('There is no record of you found.');
					}
				} else {
					if (global_variables.hash_map.has(message.mentions.users.first().username)) {
						global_variables.hash_map.set(message.mentions.users.first().username, global_variables.hash_map.get(message.mentions.users.first().username) - parseInt(split_message[1]));
						if (global_variables.hash_map.get(message.mentions.users.first().username) < 0) {
							global_variables.hash_map.set(message.mentions.users.first().username, 0);
						}
						message.reply(`Subtracted the number given from the record of <@${message.mentions.users.first().id}>.`);
					} else {
						message.reply(`No record for <@${message.mentions.users.first().id}> found.`);
					}
				}
			} else {
				message.reply('Command has been given the wrong number as argument. The number should be in between 0 and 8');
			}
		} else {
			message.reply('Command has the wrong argument. The argument should be a number.');
		}
	} else {
		message.reply('Command should have atleast 1 argument and 2 is maximum.');
	}
}

let command_add = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 2 || split_message.length == 3) {
		if (!isNaN(parseInt(split_message[1]))) {
			if (parseInt(split_message[1]) > 0 && parseInt(split_message[1]) <= global_variables.max_status_updates_limit) {
				if (message.mentions.users.first() === undefined) {
					if (global_variables.hash_map.has(message.author.username)) {
						global_variables.hash_map.set(message.author.username, global_variables.hash_map.get(message.author.username) + parseInt(split_message[1]));
						if (global_variables.hash_map.get(message.author.username) > global_variables.max_status_updates_limit) {
							global_variables.hash_map.set(message.author.username, global_variables.max_status_updates_limit);
						}
						message.reply('Added the number given to your record.');
					} else {
						message.reply('There is no record of you found.');
					}
				} else {
					if (global_variables.hash_map.has(message.mentions.users.first().username)) {
						global_variables.hash_map.set(message.mentions.users.first().username, global_variables.hash_map.get(message.mentions.users.first().username) + parseInt(split_message[1]));
						if (global_variables.hash_map.get(message.mentions.users.first().username) > global_variables.max_status_updates_limit) {
							global_variables.hash_map.set(message.mentions.users.first().username, global_variables.max_status_updates_limit);
						}
						message.reply(`Added the number given to the record of <@${message.mentions.users.first().id}>.`);
					} else {
						message.reply(`No record for <@${message.mentions.users.first().id}> found.`);
					}
				}
			} else {
				message.reply('Command has been given the wrong number as argument. The number should be in between 0 and 8.');
			}
		} else {
			message.reply('Command has a wrong argument. The argument should be a number.');
		}
	} else {
		message.reply('Command has less arguments. Please mention the number to deduct.');
	}
}

let command_reset = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		for (let key of global_variables.hash_map.keys()) {
			global_variables.hash_map.set(key, 0);
		}
		message.reply('Resetted all the stats.');
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_delete = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1 || split_message.length == 2) {
		if (message.mentions.users.first() === undefined) {
			global_variables.hash_map.delete(message.author.username);
			global_variables.name_map.delete(message.author.username);
			message.reply('Deleted you.');
		} else {
			global_variables.hash_map.delete(message.mentions.users.first().username);
			global_variables.name_map.delete(message.mentions.users.first().username);
			message.reply(`Deleted <@${message.mentions.users.first().id}>.`);
		}
	} else {
		message.reply('Command accepts only 1 argument.');
	}
}

let command_delete_all = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		if (global_variables.hash_map.size !== 0) {
			global_variables.hash_map.clear();
			global_variables.name_map.clear();
			message.reply('Deleted all the records of users.');
		} else {
			message.reply('No entries recorded.');
		}
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_backup = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		if (!support_functions.backup()) {
			message.reply('Backup failed. Please consult the bot-dev once about this message.');
		} else {
			message.reply('Backup done.');
		}
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_load_backup = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		if (!support_functions.load_backup()) {
			message.reply('Backup failed. Please consult the bot-dev once about this message.');
		} else {
			message.reply('Backup loaded.');
		}
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_shutdown = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		command_backup(message);
		message.reply('Bot is shutting down.');
		process.exit();
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

module.exports = {
	command_ping,
	command_user_help,
	command_admin_help,
	command_status_update,
	command_stats_all,
	command_stats,
	command_subtract,
	command_add,
	command_reset,
	command_delete,
	command_delete_all,
	command_backup,
	command_load_backup,
	command_shutdown
}
