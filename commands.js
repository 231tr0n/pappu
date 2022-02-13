const sf = require('./helpers');

const commands = {};

commands.ping = (message) => {
	message.reply(`${Math.round(bot.ws.ping)}ms pong.`);
};

commands.version = (message) => {
	message.reply('Version: 3.0');
};

commands.admin_help = (message) => {
	message.reply([
		'```',
		'"$" is the key letter for the bot commands.',
		'"$ping" is to check whether the bot is functioning or not.',
		'"$version" is to get the version of the bot.',
		'"$help" is for getting a list of commands for the bot.',
		'"$update_nickname" is for updating your nickname in the records whenever you change your nickname.',
		'"$update_nickname_with_id [Integer] [String]" is for updating the nickname of a particular id.',
		'Your status_update should be enclosed in three backticks so that it gets recorded by the bot.',
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
};

commands.user_help = (message) => {
	message.reply([
		'```',
		'"$" is the key letter for the bot commands.',
		'"$ping" is to check whether the bot is functioning or not.',
		'"$version" is to get the version of the bot.',
		'"$help" is for getting a list of commands for the bot.',
		'"$update_nickname" is for updating your nickname in the records whenever you change your nickname.',
		'Your status_update should be enclosed in three backticks so that it gets recorded by the bot.',
		'"$stats [@mention(optional)]" should be typed by the user who wants to see their stats regarding their status updates.',
		'"$stats_all" should be typed to get the stats of all the user\'s status updates.',
		'```'
	].join('\n'));
};

commands.update_nickname = (message) => {
	const user = message.author;
	const guild = message.member;
	if (db[user.id]) {
		db[user.id].display_name = guild.displayName;
		message.reply('Updated your nickname.');
	} else {
		message.reply('No record found on you.');
	}
};

commands.update_nickname_with_id = (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 3 && split_message[1].length && split_message[2].length < max_characters) {
		if (db[split_message[1]]) {
			db[split_message[1]].display_name = split_message[2];
			message.reply('Nickname is updated.');
		} else {
			message.reply('No entry found.');
		}
	} else {
		message.reply('Command should have 2 arguments whose size is less than', max_characters, '.');
	}
};

commands.status_update = (message) => {
	if (message.content.startsWith('```') && message.content.endsWith('```')) {
		const user = message.author;
		const guild = message.member;
		if (db[user.id]) {
			if (db[user.id].weekly_updates_count < 7) {
				db[user.id].weekly_updates_count += 1;
				db[user.id].montly_updates_count += 1;
				message.react(done_character);
			} else {
				message.react(fail_character);
				message.reply('Are you stupid, how can you put more than 7 status updates in a week.');
			}
		} else {
			db[user.id] = {
				display_name: guild.displayName,
				weekly_updates_count: 1,
				montly_updates_count: 1,
				total_leaves: 0,
				leaves: 0
			};
			message.react(created_character);
			message.react(done_character);
		}
	}
};

commands.take_leave = (message) => {
	const user = message.author;
	if (db[user.id].leaves < (7 - db[user.id].weekly_updates_count)) {
		db[user.id].leaves += 1;
		db[user.id].total_leaves += 1;
		message.react(done_character);
	} else {
		message.react(fail_character);
		message.reply('Are you stupid. How can you take more leaves in the remaining number of days in a week.');
	}
};

commands.weekly_stats_all = (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 1) {
		if (Object.keys(db).length == 0) {
			message.reply('No entries recorded.');
		} else {
			let reply_message = '';
			for (const value of Object.values(db)) {
				for (let i = 0; i < value.weekly_updates_count; i ++) {
					reply_message += status_update_character;
				}
				for (let i = 0; i < value.leaves; i ++) {
					reply_message += leave_character;
				}
				for (let i = 0; i < 7 - value.weekly_updates_count - value.leaves; i ++) {
					reply_message += no_status_update_character;
				}
				reply_message += ` ${arrow_character} ${value.display_name}${value_differentiating_character} Weekly - ${value.weekly_updates_count} & Leaves - ${value.leaves}`;
				reply_message += '\n';
			}
			message.reply(`\`\`\`${reply_message}\`\`\``);
		}
	} else {
		message.reply('Command doesn\'t accept any arguments.');
	}
};

commands.show_all_ids = (message) => {
	if (Object.keys(db).length == 0) {
		message.reply('No entries recorded.');
	} else {
		let reply_message = '';
		for (const [key, value] of Object.entries(db)) {
			reply_message += `${key} ${arrow_character} ${value.display_name}${value_differentiating_character} Weekly - ${value.weekly_updates_count} & Monthly - ${value.montly_updates_count} & Leaves - ${value.leaves} & Total Leaves - ${value.total_leaves}\n`;
		}
		message.channel.send(`\`\`\`${reply_message}\`\`\``);
	}
};

commands.show_id = (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 2 && split_message[1].length < max_characters) {
		if (db[split_message[1]]) {
			const value = db[split_message[1]];
			message.reply(`\`\`\`${split_message[1]} ${arrow_character} ${value.display_name}${value_differentiating_character} Weekly - ${value.weekly_updates_count} & Monthly - ${value.montly_updates_count} & Leaves - ${value.leaves} & Total Leaves - ${value.total_leaves}\`\`\``);
		} else {
			message.reply('No entries recorded.');
		}
	} else {
		message.reply('Command accepts 1 argument whose length is less than', max_characters, '.');
	}
};

commands.stats = (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 1 || split_message.length == 2) {
		if (Object.keys(db).length == 0) {
			message.reply('No entries recorded.');
		} else {
			let reply_message = '';
			if (message.mentions.users.first() == undefined) {
				const user = message.author;
				if (db[user.id]) {
					const value = db[user.id];
					reply_message += `${user.id} ${arrow_character} ${value.display_name}${value_differentiating_character} Weekly - ${value.weekly_updates_count} & Monthly - ${value.montly_updates_count} & Leaves - ${value.leaves} & Total Leaves - ${value.total_leaves}`;
				} else {
					reply_message += 'No record found.';
				}
			} else {
				const mentioned_user = message.mentions.users.first();
				if (db[mentioned_user.id]) {
					const value = db[mentioned_user.id];
					reply_message += `${mentioned_user.id} ${arrow_character} ${value.display_name}${value_differentiating_character} Weekly - ${value.weekly_updates_count} & Monthly - ${value.montly_updates_count} & Leaves - ${value.leaves} & Total Leaves - ${value.total_leaves}`;
				} else {
					reply_message += 'No record found.';
				}
			}
			message.reply(`\`\`\`${reply_message}\`\`\``);
		}
	} else {
		message.reply('Command accept only 1 arguments.');
	}
};

commands.edit_user = (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 3 || split_message.length == 4) {
		if (message.mentions.users.first()) {
			try {
				const weekly_updates = parseInt(split_message[2]);
				const leaves = parseInt(split_message[3]);
				const mentioned_user = message.mentions.users.first();
				if (weekly_updates < 8 && weekly_updates >= 0) {
					if (leaves < 8 && leaves >= 0 && (weekly_updates + leaves <= 7)) {
						db[mentioned_user.id].montly_updates_count -= db[mentioned_user.id].weekly_updates_count;
						db[mentioned_user.id].montly_updates_count += weekly_updates;
						db[mentioned_user.id].total_leaves -= db[mentioned_user.id].leaves;
						db[mentioned_user.id].total_leaves += leaves;
						db[mentioned_user.id].weekly_updates_count = weekly_updates;
						db[mentioned_user.id].leaves = leaves;
					} else {
						message.reply('Weekly updates and leaves must sum up to seven.');
					}
				} else {
					message.reply('Weekly updates value exceeds 7 or is less than 0.');
				}
			} catch (error) {
				message.reply('You entered non integer values for any one of the 3 arguments required.');
			}
		} else {
			try {
				const weekly_updates = parseInt(split_message[1]);
				const leaves = parseInt(split_message[2]);
				const user = message.author;
				if (weekly_updates < 8 && weekly_updates >= 0) {
					if (leaves < 8 && leaves >= 0 && (weekly_updates + leaves <= 7)) {
						db[user.id].montly_updates_count -= db[user.id].weekly_updates_count;
						db[user.id].montly_updates_count += weekly_updates;
						db[user.id].total_leaves -= db[user.id].leaves;
						db[user.id].total_leaves += leaves;
						db[user.id].weekly_updates_count = weekly_updates;
						db[user.id].leaves = leaves;
					} else {
						message.reply('Weekly updates and leaves must sum up to seven.');
					}
				} else {
					message.reply('Weekly updates value exceeds 7 or is less than 0.');
				}
			} catch (error) {
				message.reply('You entered non integer values for any one of the 3 arguments required.');
			}
		}
	} else {
		message.reply('Command accepts 3 argument.');
	}
};

commands.edit_id = (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 4) {
		if (db[split_message[1]]) {
			try {
				const weekly_updates = parseInt(split_message[2]);
				const leaves = parseInt(split_message[3]);
				if (weekly_updates < 8 && weekly_updates >= 0) {
					if (leaves < 8 && leaves >= 0 && (weekly_updates + leaves <= 7)) {
						db[split_message[1]].montly_updates_count -= db[split_message[1]].weekly_updates_count;
						db[split_message[1]].montly_updates_count += weekly_updates;
						db[split_message[1]].total_leaves -= db[split_message[1]].leaves;
						db[split_message[1]].total_leaves += leaves;
						db[split_message[1]].weekly_updates_count = weekly_updates;
						db[split_message[1]].leaves = leaves;
					} else {
						message.reply('Weekly updates and leaves must sum less than or equal to seven.');
					}
				} else {
					message.reply('Weekly updates value exceeds 7 or is less than 0.');
				}
			} catch (error) {
				message.reply('You entered non integer values for any one of the 3 arguments required.');
			}
		} else {
			message.reply('No record found.');
		}
	} else {
		message.reply('Command accepts 3 arguments.');
	}
};

commands.add_user = (message) => {
	const split_message = message.split(' ');
	if (split_message.length == 1 || split_message.length == 2) {
		if (message.mentions.users.first() == undefined) {
			const user = message.author;
			if (!db[user.id]) {
				db[user.id] = {
					display_name: user.displayName,
					montly_updates_count: 0,
					weekly_updates_count: 0,
					leaves: 0,
					total_leaves: 0
				};
				message.reply('Created a record for you.');
			}
		} else {
			const mentioned_user = message.mentions.users.first();
			if (!db[mentioned_user.id]) {
				db[mentioned_user.id] = {
					display_name: mentioned_user.displayName,
					montly_updates_count: 0,
					weekly_updates_count: 0,
					leaves: 0,
					total_leaves: 0
				};
				message.reply(`Created a record for <@${mentioned_user.id}.`);
			}
		}
	} else {
		message.reply('Command accepts only 1 argument at max.');
	}
};

commands.total_reset = (message) => {
	for (const key of Object.keys(db)) {
		db[key].monthly_updates_count = 0;
		db[key].weekly_updates_count = 0;
		db[key].leaves = 0;
		db[key].total_leaves = 0;
	}
	message.reply('Resetted all the stats.');
};

commands.monthly_reset = (message) => {
	for (const key of Object.keys(db)) {
		db[key].montly_updates_count = 0;
		db[key].total_leaves = 0;
	}
	message.reply('Resetted monthly stats.');
};

commands.weekly_reset = (message) => {
	for (const key of Object.keys(db)) {
		db[key].weekly_updates_count = 0;
		db[key].leaves = 0;
	}
	message.reply('Resetted weekly stats.');
};

commands.delete_user = (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 1 || split_message.length == 2) {
		if (message.mentions.users.first() === undefined) {
			delete db[message.author.id];
			message.reply('Deleted you.');
		} else {
			delete db[message.mentions.users.first().id];
			message.reply(`Deleted <@${message.mentions.users.first().id}>.`);
		}
	} else {
		message.reply('Command accepts only 1 argument.');
	}
};

commands.delete_id = (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 2 && split_message[1].length < max_characters) {
		if (db[split_message[1]]) {
			delete db[split_message[1]];
			message.reply(`Deleted <@${split_message[1]}>.`);
		} else {
			message.reply('No record for that particular id found.');
		}
	} else {
		message.reply('Command accepts 1 argument.');
	}
};

commands.delete_all = (message) => {
	db = {};
	message.reply('Deleted all the records of users.');
};

commands.backup = (message) => {
	if (sf.backup()) {
		message.reply('Backup done.');
	} else {
		message.reply('Backup creation failed. Please consult the bot-dev once about this message.');
	}
};

commands.delete_backup = (message) => {
	if (sf.delete_backup()) {
		message.reply('Backup deleted.');
	} else {
		message.reply('Backup delete failed. Please consult the bot-dev once about this message.');
	}
};

commands.load_backup = (message) => {
	if (sf.load_backup()) {
		message.reply('Backup loaded.');
	} else {
		message.reply('Backup loading failed. Please consult the bot-dev once about this message.');
	}
};

commands.shutdown = (message) => {
	if (commands.backup(message)) {
		message.reply('Backup done.');
	} else {
		message.reply('Backup failed.');
	}
	message.reply('Bot is shutting down.');
	process.exit();
};

module.exports = commands;
