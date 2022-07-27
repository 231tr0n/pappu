const sf = require('./helpers');
const model = require('./models');

const commands = {};

commands.ping = {
	type: 'user',
	description: 'Shows ping',
	handler: async (message) => {
		message.reply(`${Math.round(bot.ws.ping)}ms pong.`);
	}
};

commands.help = {
	type: 'user',
	description: 'Shows help',
	handler: async (message) => {
		let temp = '```';
		for (const i in commands) {
			if (status_updates_channels.includes(message.channel.id)) {
				if (commands[i].type == 'user') {
					temp += `${i}: ${commands[i].description}\n`;
				}
			} else if (admin_commands_channels.includes(message.channel.id)) {
				temp += `${i}: ${commands[i].description}\n`;
			}
		}
		temp += '```';
		message.reply(temp);
	}
};

commands.update_nickname = {
	type: 'user',
	description: 'Updates nickname of the user',
	handler: async (message) => {
		const user = message.author;
		const guild = message.member;
		if (db[user.id]) {
			db[user.id].display_name = guild.displayName;
			message.react(done_character);
		} else {
			message.reply('No record found on you.');
		}
	}
};

commands.update_nickname_with_id = {
	type: 'admin',
	description: 'Updates nickname of the user using id',
	handler: async (message) => {
		const split_message = message.content.split(' ');
		if (split_message.length == 3 && split_message[1].length && split_message[2].length < max_characters) {
			if (db[split_message[1]]) {
				db[split_message[1]].display_name = split_message[2];
				message.react(done_character);
			} else {
				message.reply('No entry found.');
			}
		} else {
			message.reply('Command should have 2 arguments whose size is less than', max_characters, '.');
		}
	}
};

commands.status_update = {
	type: 'user',
	description: 'Shows status update of the user',
	handler: async (message) => {
		if (message.content.startsWith('```') && message.content.endsWith('```')) {
			const user = message.author;
			const guild = message.member;
			if (db[user.id]) {
				if ((db[user.id].weekly_updates_count + db[user.id].leaves) < 7) {
					db[user.id].weekly_updates_count += 1;
					db[user.id].monthly_updates_count += 1;
					message.react(done_character);
				} else {
					message.react(fail_character);
					message.reply('Are you stupid, how can you put more than 7 status updates in a week.');
				}
			} else {
				db[user.id] = model(guild.displayName, 1, 1, 0, 0);
				message.react(created_character);
				message.react(done_character);
			}
		}
	}
};

commands.take_leave = {
	type: 'user',
	description: 'User can take a leave',
	handler: async (message) => {
		const user = message.author;
		if (db[user.id]) {
			if (db[user.id].leaves < (7 - db[user.id].weekly_updates_count)) {
				db[user.id].leaves += 1;
				db[user.id].total_leaves += 1;
				message.react(done_character);
			} else {
				message.react(fail_character);
				message.reply('Are you stupid. How can you take more leaves in the remaining number of days in a week.');
			}
		} else {
			db[user.id] = model(message.member.displayName, 0, 0, 1, 1);
			message.react(done_character);
		}
	}
};

commands.weekly_stats_all = {
	type: 'user',
	description: 'Shows weekly stats of all users',
	handler: async (message) => {
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
	}
};

commands.show_all_ids = {
	type: 'admin',
	description: 'Shows all ids of all users',
	handler: async (message) => {
		if (Object.keys(db).length == 0) {
			message.reply('No entries recorded.');
		} else {
			let reply_message = '';
			for (const [key, value] of Object.entries(db)) {
				reply_message += `${key} ${arrow_character} ${value.display_name}${value_differentiating_character} Weekly - ${value.weekly_updates_count} & Monthly - ${value.monthly_updates_count} & Leaves - ${value.leaves} & Total Leaves - ${value.total_leaves}\n`;
			}
			message.channel.send(`\`\`\`${reply_message}\`\`\``);
		}
	}
};

commands.show_id = {
	type: 'admin',
	description: 'Shows id of the user',
	handler: async (message) => {
		const split_message = message.content.split(' ');
		if (split_message.length == 2) {
			if (db[split_message[1]]) {
				const value = db[split_message[1]];
				message.reply(`\`\`\`${split_message[1]} ${arrow_character} ${value.display_name}${value_differentiating_character} Weekly - ${value.weekly_updates_count} & Monthly - ${value.monthly_updates_count} & Leaves - ${value.leaves} & Total Leaves - ${value.total_leaves}\`\`\``);
			} else {
				message.reply('No entries recorded.');
			}
		} else {
			message.reply('Command accepts 1 argument.');
		}
	}
};

commands.stats = {
	type: 'user',
	description: 'Shows stats of the user',
	handler: async (message) => {
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
						reply_message += `${user.id} ${arrow_character} ${value.display_name}${value_differentiating_character} Weekly - ${value.weekly_updates_count} & Monthly - ${value.monthly_updates_count} & Leaves - ${value.leaves} & Total Leaves - ${value.total_leaves}`;
					} else {
						reply_message += 'No record found.';
					}
				} else {
					const mentioned_user = message.mentions.users.first();
					if (db[mentioned_user.id]) {
						const value = db[mentioned_user.id];
						reply_message += `${mentioned_user.id} ${arrow_character} ${value.display_name}${value_differentiating_character} Weekly - ${value.weekly_updates_count} & Monthly - ${value.monthly_updates_count} & Leaves - ${value.leaves} & Total Leaves - ${value.total_leaves}`;
					} else {
						reply_message += 'No record found.';
					}
				}
				message.reply(`\`\`\`${reply_message}\`\`\``);
			}
		} else {
			message.reply('Command accept only 1 argument.');
		}
	}
};

commands.edit_user = {
	type: 'admin',
	description: 'Edits the user details',
	handler: async (message) => {
		const split_message = message.content.split(' ');
		if (split_message.length == 3 || split_message.length == 4) {
			if (message.mentions.users.first()) {
				try {
					const weekly_updates = parseInt(split_message[2]);
					const leaves = parseInt(split_message[3]);
					const mentioned_user = message.mentions.users.first();
					if (weekly_updates < 8 && weekly_updates >= 0) {
						if (leaves < 8 && leaves >= 0 && (weekly_updates + leaves <= 7)) {
							db[mentioned_user.id].monthly_updates_count -= db[mentioned_user.id].weekly_updates_count;
							db[mentioned_user.id].monthly_updates_count += weekly_updates;
							db[mentioned_user.id].total_leaves -= db[mentioned_user.id].leaves;
							db[mentioned_user.id].total_leaves += leaves;
							db[mentioned_user.id].weekly_updates_count = weekly_updates;
							db[mentioned_user.id].leaves = leaves;
							message.react(done_character);
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
							db[user.id].monthly_updates_count -= db[user.id].weekly_updates_count;
							db[user.id].monthly_updates_count += weekly_updates;
							db[user.id].total_leaves -= db[user.id].leaves;
							db[user.id].total_leaves += leaves;
							db[user.id].weekly_updates_count = weekly_updates;
							db[user.id].leaves = leaves;
							message.react(done_character);
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
		}
	}
};

commands.change_weekly_reset_day_number = {
	type: 'admin',
	description: 'Changes the day number of weekly reset',
	handler: async (message) => {
		const split_message = message.content.split(' ');
		if (split_message.length == 2) {
			let x = 0;
			let bool = false;
			try {
				x = parseInt(split_message[1]);
				if (x >= 0 && x <= 6) {
					bool = true;
				} else {
					message.reply('You entered wrong number. The range is from 0 to 6.');
				}
			} catch (error) {
				message.reply('You entered wrong number. The range is from 0 to 6.');
			}
			if (bool) {
				weekly_reset_day_number = x;
				message.react(done_character);
				message.reply(`Day: ${weekly_reset_day_number}`);
			}
		} else {
			message.reply('Command accepts 1 argument.');
		}
	}
};

commands.edit_id = {
	type: 'admin',
	description: 'Changes the weekly updates and leaves of a user',
	handler: async (message) => {
		const split_message = message.content.split(' ');
		if (split_message.length == 4) {
			if (db[split_message[1]]) {
				try {
					const weekly_updates = parseInt(split_message[2]);
					const leaves = parseInt(split_message[3]);
					if (weekly_updates < 8 && weekly_updates >= 0) {
						if (leaves < 8 && leaves >= 0 && (weekly_updates + leaves <= 7)) {
							db[split_message[1]].monthly_updates_count -= db[split_message[1]].weekly_updates_count;
							db[split_message[1]].monthly_updates_count += weekly_updates;
							db[split_message[1]].total_leaves -= db[split_message[1]].leaves;
							db[split_message[1]].total_leaves += leaves;
							db[split_message[1]].weekly_updates_count = weekly_updates;
							db[split_message[1]].leaves = leaves;
							message.react(done_character);
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
	}
};

commands.add_user = {
	type: 'admin',
	description: 'Adds a user to the database',
	handler: async (message) => {
		const split_message = message.content.split(' ');
		if (split_message.length == 1 || split_message.length == 2) {
			if (message.mentions.users.first() == undefined) {
				const user = message.author;
				if (!db[user.id]) {
					db[user.id] = model(message.member.displayName, 0, 0, 0, 0);
				}
			} else {
				const mentioned_user = message.mentions.users.first();
				if (!db[mentioned_user.id]) {
					db[mentioned_user.id] = model('', 0, 0, 0, 0);
				}
			}
			message.react(done_character);
		} else {
			message.reply('Command accepts only 1 argument at max.');
		}
	}
};

commands.add_id = {
	type: 'admin',
	description: 'Adds a user using id to the database',
	handler: async (message) => {
		const split_message = message.content.split(' ');
		if (split_message.length == 2) {
			if (!db[split_message[1]]) {
				db[split_message[1]] = model('', 0, 0, 0, 0);
			}
			message.react(done_character);
		} else {
			message.reply('Command accepts only 1 argument.');
		}
	}
};

commands.get_meeting_absentees_list = {
	type: 'user',
	description: 'Gets the list of members who are absent from the meeting',
	handler: async (message) => {
		const guild = bot.guilds.cache.get(server_id);
		let member = null;
		let reply_message = '***The following list of members are absent.***\n';
		for (const key of Object.keys(db)) {
			if (guild.members.cache.get(key)) {
				member = guild.members.cache.get(key);
				if (!member?.voice?.channel) {
					reply_message += `<@${member.id}>\n`;
				}
			}
		}
		message.reply(reply_message);
	}
};

commands.total_reset = {
	type: 'admin',
	description: 'Resets the all the monthly,weekly updates and leaves of all the users',
	handler: async (message) => {
		for (const key of Object.keys(db)) {
			db[key].monthly_updates_count = 0;
			db[key].weekly_updates_count = 0;
			db[key].leaves = 0;
			db[key].total_leaves = 0;
		}
		message.react(done_character);
	}
};

commands.monthly_reset = {
	type: 'admin',
	description: 'Resets the monthly updates and leaves of all the users',
	handler: async (message) => {
		for (const key of Object.keys(db)) {
			db[key].monthly_updates_count = 0;
			db[key].total_leaves = 0;
		}
		message.react(done_character);
	}
};

commands.weekly_reset = {
	type: 'admin',
	description: 'Resets the weekly updates and leaves of all the users',
	handler: async (message) => {
		for (const key of Object.keys(db)) {
			db[key].weekly_updates_count = 0;
			db[key].leaves = 0;
		}
		message.react(done_character);
	}
};

commands.delete_user = {
	type: 'admin',
	description: 'Deletes a user from the database',
	handler: async (message) => {
		const split_message = message.content.split(' ');
		if (split_message.length == 1 || split_message.length == 2) {
			if (message.mentions.users.first() === undefined) {
				delete db[message.author.id];
			} else {
				delete db[message.mentions.users.first().id];
			}
			message.react(done_character);
		} else {
			message.reply('Command accepts only 1 argument.');
		}
	}
};

commands.delete_id = {
	type: 'admin',
	description: 'Deletes a user using id from the database',
	handler: async (message) => {
		const split_message = message.content.split(' ');
		if (split_message.length == 2) {
			if (db[split_message[1]]) {
				delete db[split_message[1]];
				message.react(done_character);
			} else {
				message.reply('No record for that particular id found.');
			}
		} else {
			message.reply('Command accepts 1 argument.');
		}
	}
};

commands.delete_all = {
	type: 'admin',
	description: 'Deletes all the users from the database',
	handler: async (message) => {
		db = {};
		message.react(done_character);
	}
};

commands.backup = {
	type: 'admin',
	description: 'Backs up the database',
	handler: async (message) => {
		if (sf.backup()) {
			message.react(done_character);
		} else {
			message.reply('Backup creation failed. Please consult the bot-dev once about this message.');
		}
	}
};

commands.delete_backup = {
	type: 'admin',
	description: 'Deletes the backup data',
	handler: async (message) => {
		if (sf.delete_backup()) {
			message.react(done_character);
		} else {
			message.reply('Backup delete failed. Please consult the bot-dev once about this message.');
		}
	}
};

commands.load_backup = {
	type: 'admin',
	description: 'Loads the backup data',
	handler: async (message) => {
		if (sf.load_backup()) {
			message.react(done_character);
		} else {
			message.reply('Backup loading failed. Please consult the bot-dev once about this message.');
		}
	}
};

commands.shutdown = {
	type: 'admin',
	description: 'Shuts down the bot',
	handler: async (message) => {
		if (sf.backup()) {
			await message.react(done_character);
		} else {
			await message.reply('Backup failed.');
		}
		await message.reply('Backup complete. Bot is shutting down.');
		// 	clearInterval(interval);
		bot.destroy();
		process.exit();
	}
};

module.exports = commands;
