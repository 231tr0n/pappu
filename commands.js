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

let command_version = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		message.reply('Version: 2.0');
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_admin_help = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		message.channel.send([
			'```',
			'"$" is the key letter for the bot commands.',
			'"$ping" is to check whether the bot is functioning or not.',
			'"$version" is to get the version of the bot.',
			'"$help" is for getting a list of commands for the bot.',
			'"$update_nickname" is for updating your nickname in the records whenever you change your nickname.',
			'"$update_nickname_with_id [Integer] [String]" is for updating the nickname of a particular id.',
			'"$status_update" should be typed before your status updates so that it gets recorded by the bot.',
			'"$stats [@mention(optional)]" should be typed by the user who wants to see their stats regarding their status updates.',
			'"$stats_all" should be typed to get the stats of all the user\'s status updates.',
			'"$show_all_entries" prints all the keys, status_updates and usernames stored in the record.',
			'"$show_entry [Integer]" shows the record of a particular id.',
			'"$subtract [Integer] [@mention(optional)]" is used to deduct the number specified to their status updates count.',
			'"$add [Integer] [@mention(optional)]" is used to add the number specified to their status updates count.',
			'"$add_user [@mention(optional)]" adds a user mentioned to the records.',
			'"$reset" is used to reset all the stats to 0.',
			'"$delete [@mention(optional)]" is used to delete the entry of a user.',
			'"$delete_all" will delete the entries of all the users.',
			'"$delete_id [Integer]" is used to delete a particular user_id from the records.',
			'"$backup" will write the present Map object to a file accessible on the server-side.',
			'"$delete_backup" will delete the backup stored on the server-side.',
			'"$load_backup" loads the data in the backup file.',
			'"$shutdown" shutdowns the bot.',
			'```'
		].join('\n'));
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_user_help = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		message.channel.send([
			'```',
			'"$" is the key letter for the bot commands.',
			'"$ping" is to check whether the bot is functioning or not.',
			'"$version" is to get the version of the bot.',
			'"$help" is for getting a list of commands for the bot.',
			'"$update_nickname" is for updating your nickname in the records whenever you change your nickname.',
			'"$status_update" should be typed before your status updates so that it gets recorded by the bot.',
			'"$stats [@mention(optional)]" should be typed by the user who wants to see their stats regarding their status updates.',
			'"$stats_all" should be typed to get the stats of all the user\'s status updates.',
			'```'
		].join('\n'));
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_update_nickname = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		let user = message.author;
		let guild = message.member;
		if (global_variables.hash_map.has(user.id)) {
			if (global_variables.hash_map.get(user.id).display_name === guild.displayName) {
				message.reply('Your nickname is already updated.');
			} else {
				global_variables.hash_map.set(user.id, {
					display_name : guild.displayName,
					status_updates_count : global_variables.hash_map.get(user.id).status_updates_count
				});
				message.reply('Updated your nickname.');
			}
		} else {
			message.reply('No record found on you.');
		}
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_update_nickname_with_id = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 3) {
		if (!isNaN(split_message[1])) {
			if (split_message[2].length <= global_variables.max_characters) {
				let temp = split_message[1];
				if (global_variables.hash_map.has(temp)) {
					global_variables.hash_map.set(temp, {
						display_name : split_message[2],
						status_updates_count : global_variables.hash_map.get(temp).status_updates_count
					});
					message.reply('Nickname of the id ' + temp + ' is updated.');
				} else {
					message.reply('No entry found.');
				}
			} else {
				message.reply('String size is more than ' + global_variables.max_characters.toString() + '.');
			}
		} else {
			message.reply('Command has wrong second argument which should be a number.');
		}
	} else {
		message.reply('Command should have 2 arguments.');
	}
}

let command_status_update = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		let user = message.author;
		let guild = message.member;
		if (global_variables.hash_map.has(user.id)) {
			if (global_variables.hash_map.get(user.id).status_updates_count >= global_variables.max_status_updates_limit) {
				if (global_variables.hash_map.get(user.id).status_updates_count > global_variables.max_status_updates_limit) {
					global_variables.hash_map.set(user.id, {
						display_name : global_variables.hash_map.get(user.id).display_name,
						status_updates_count : global_variables.max_status_updates_limit
					});
				}
				message.reply('Are you stupid. How can you put more than ' + global_variables.max_status_updates_limit.toString() + ' status updates in ' + global_variables.max_status_updates_limit.toString() + ' days.');
			} else {
				global_variables.hash_map.set(user.id, {
					display_name : global_variables.hash_map.get(user.id).display_name,
					status_updates_count : global_variables.hash_map.get(user.id).status_updates_count + 1
				});
				message.react(global_variables.status_update_character);
			}
		} else {
			global_variables.hash_map.set(user.id, {
				display_name : guild.displayName,
				status_updates_count : 1
			});
			message.react(global_variables.created_character);
			message.react(global_variables.status_update_character);
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
			for (let value of global_variables.hash_map.values()) {
				for (let i = 0; i < value.status_updates_count; i ++) {
					reply_message += global_variables.status_update_character;
				}
				if (global_variables.max_status_updates_limit >= value.status_updates_count) {
					for (let i = 0; i < (global_variables.max_status_updates_limit - value.status_updates_count); i ++) {
						reply_message += global_variables.no_status_update_character;
					}
				}
				reply_message += ' ' + global_variables.arrow_character + ' ' + value.display_name + global_variables.value_differentiating_character + ' ' + value.status_updates_count + '\n';
			}
			message.channel.send('```' + reply_message + '```');
		}
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_show_all_entries = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		if (global_variables.hash_map.size == 0) {
			message.reply('No entries recorded.');
		} else {
			let reply_message = '';
			for (let [key, value] of global_variables.hash_map.entries()) {
				reply_message += key + ' ' + global_variables.arrow_character + ' ' + value.display_name + global_variables.value_differentiating_character + ' ' + value.status_updates_count + '\n';
			}
			message.channel.send('```' + reply_message + '```');
		}
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_show_entry = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 2) {
		if (!isNaN(split_message[1])) {
			let temp = parseInt(split_message[1]);
			if (global_variables.hash_map.has(temp)) {
				message.reply('```' + temp.toString() + ' ' + global_variables.arrow_character + ' ' + global_variables.hash_map.get(temp).display_name + global_variables.value_differentiating_character + ' ' + global_variables.hash_map.get(temp).status_updates_count + '```');
			} else {
				message.reply('No entries recorded.');
			}
		} else {
			message.reply('Command has wrong argument which should be a number.');
		}
	} else {
		message.reply('Command accepts 1 argument.');
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
				let user = message.author;
				if (global_variables.hash_map.has(user.id)) {
					let temp = global_variables.hash_map.get(user.id).status_updates_count;
					for (let i = 0; i < temp; i ++) {
						reply_message += global_variables.status_update_character;
					}
					if (global_variables.max_status_updates_limit >= temp) {
						for (let i = 0; i < (global_variables.max_status_updates_limit - temp); i ++) {
							reply_message += global_variables.no_status_update_character;
						}
					}
					reply_message += ' ' + global_variables.arrow_character + ' ' + global_variables.hash_map.get(user.id).display_name + global_variables.value_differentiating_character + ' ' + temp;
					message.reply('```' + reply_message + '```');
				} else {
					message.reply('No record of you found.');
				}
			} else {
				let mentioned_user = message.mentions.users.first();
				if (global_variables.hash_map.has(mentioned_user.id)) {
					let temp = global_variables.hash_map.get(mentioned_user.id).status_updates_count;
					for (let i = 0; i < temp; i ++) {
						reply_message += global_variables.status_update_character;
					}
					if (global_variables.max_status_updates_limit >= temp) {
						for (let i = 0; i < (global_variables.max_status_updates_limit - temp); i ++) {
							reply_message += global_variables.no_status_update_character;
						}
					}
					reply_message += ' ' + global_variables.arrow_character + ' ' + global_variables.hash_map.get(mentioned_user.id).display_name + global_variables.value_differentiating_character + ' ' + temp;
					message.reply('```' + reply_message + '```');
				} else {
					message.reply(`No record for <@${mentioned_user.id}> found.`);
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
					let user = message.author;
					if (global_variables.hash_map.has(user.id)) {
						global_variables.hash_map.set(user.id, {
							display_name : global_variables.hash_map.get(user.id).display_name,
							status_updates_count : global_variables.hash_map.get(user.id).status_updates_count - parseInt(split_message[1])
						});
						if (global_variables.hash_map.get(user.id).status_updates_count < 0) {
							global_variables.hash_map.set(user.id, {
								display_name : global_variables.hash_map.get(user.id).display_name,
								status_updates_count : 0
							});
						}
						message.reply('Subtracted the number given from your record.');
					} else {
						message.reply('There is no record of you found.');
					}
				} else {
					let mentioned_user = message.mentions.users.first();
					if (global_variables.hash_map.has(mentioned_user.id)) {
						global_variables.hash_map.set(mentioned_user.id, {
							display_name : global_variables.hash_map.get(mentioned_user.id).display_name,
							status_updates_count : global_variables.hash_map.get(mentioned_user.id).status_updates_count - parseInt(split_message[1])
						});
						if (global_variables.hash_map.get(mentioned_user.id).status_updates_count < 0) {
							global_variables.hash_map.set(mentioned_user.id, {
								display_name : global_variables.hash_map.get(mentioned_user.id).display_name,
								status_updates_count : 0
							});
						}
						message.reply(`Subtracted the number given from the record of <@${mentioned_user.id}>.`);
					} else {
						message.reply(`No record for <@${mentioned_user.id}> found.`);
					}
				}
			} else {
				message.reply('Command has been given the wrong number as argument. The number should be in between 0 and ' + (global_variables.max_status_updates_limit + 1).toString());
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
					let user = message.author;
					if (global_variables.hash_map.has(user.id)) {
						global_variables.hash_map.set(user.id, {
							display_name : global_variables.hash_map.get(user.id).display_name,
							status_updates_count : global_variables.hash_map.get(user.id).status_updates_count + parseInt(split_message[1])
						});
						if (global_variables.hash_map.get(user.id).status_updates_count > global_variables.max_status_updates_limit) {
							global_variables.hash_map.set(user.id, {
								display_name : global_variables.hash_map.get(user.id).display_name,
								status_updates_count : global_variables.max_status_updates_limit
							});
						}
						message.reply('Added the number given to your record.');
					} else {
						message.reply('There is no record of you found.');
					}
				} else {
					let mentioned_user = message.mentions.users.first();
					if (global_variables.hash_map.has(mentioned_user.id)) {
						global_variables.hash_map.set(mentioned_user.id, {
							display_name : global_variables.hash_map.get(mentioned_user.id).display_name,
							status_updates_count : global_variables.hash_map.get(mentioned_user.id).status_updates_count + parseInt(split_message[1])
						});
						if (global_variables.hash_map.get(mentioned_user.id).status_updates_count > global_variables.max_status_updates_limit) {
							global_variables.hash_map.set(mentioned_user.id, {
								display_name : global_variables.hash_map.get(mentioned_user.id).display_name,
								status_updates_count : global_variables.max_status_updates_limit
							});
						}
						message.reply(`Added the number given to the record of <@${mentioned_user.id}>.`);
					} else {
						message.reply(`No record for <@${mentioned_user.id}> found.`);
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

let command_add_user = (message) => {
	let split_message = message.split(' ');
	if (split_message.length == 1 || split_message.length == 2) {
		if (message.mentions.users.first() === undefined) {
			if (!global_variables.hash_map.has(message.author.id)) {
				global_variables.hash_map.set(message.author.id, {
					display_name : message.author.displayName,
					status_updates_count : 0
				});
				message.reply(`Created a record for you.`);
			} else {
				message.reply('Record already exists for you.')
			}
		} else {
			if (!global_variables.hash_map.has(message.mentions.users.first().id)) {
				global_variables.hash_map.set(message.mentions.users.first().id, {
					display_name : message.mentions.users.first().displayName,
					status_updates_count : 0
				});
				message.reply(`Created a record for <@${message.mentions.users.first().id}.`);
			} else {
				message.reply(`Record already exists for <@${message.mentions.users.first().id}>.`);
			}
		}
	} else {
		message.reply('Command accepts only 1 argument at max.');
	}
}

let command_reset = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		for (let key of global_variables.hash_map.keys()) {
			global_variables.hash_map.set(key, {
				display_name : global_variables.hash_map.get(key).display_name,
				status_updates_count : 0
			});
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
			global_variables.hash_map.delete(message.author.id);
			message.reply('Deleted you.');
		} else {
			global_variables.hash_map.delete(message.mentions.users.first().id);
			message.reply(`Deleted <@${message.mentions.users.first().id}>.`);
		}
	} else {
		message.reply('Command accepts only 1 argument.');
	}
}

let command_delete_id = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 2) {
		if (!isNaN(split_message[1])) {
			let temp = split_message[1];
			if (global_variables.hash_map.has(temp)) {
				global_variables.hash_map.delete(temp);
				message.reply(`Deleted <@${temp}>.`);
			} else {
				message.reply('No record for that particular id found.');
			}
		} else {
			message.reply('Command accepts only integer as argument.');
		}
	} else {
		message.reply('Command accepts 1 argument.');
	}
}

let command_delete_all = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		if (global_variables.hash_map.size !== 0) {
			global_variables.hash_map.clear();
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
			message.reply('Backup creation failed. Please consult the bot-dev once about this message.');
		} else {
			message.reply('Backup done.');
		}
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_delete_backup = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		if (!support_functions.delete_backup()) {
			message.reply('Backup delete failed. Please consult the bot-dev once about this message.');
		} else {
			message.reply('Backup deleted.');
		}
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
}

let command_load_backup = (message) => {
	let split_message = message.content.split(' ');
	if (split_message.length == 1) {
		if (!support_functions.load_backup()) {
			message.reply('Backup loading failed. Please consult the bot-dev once about this message.');
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
	command_version,
	command_user_help,
	command_admin_help,
	command_update_nickname_with_id,
	command_update_nickname,
	command_status_update,
	command_stats_all,
	command_show_all_entries,
	command_show_entry,
	command_stats,
	command_subtract,
	command_add,
	command_add_user,
	command_reset,
	command_delete,
	command_delete_id,
	command_delete_all,
	command_backup,
	command_delete_backup,
	command_load_backup,
	command_shutdown
}
