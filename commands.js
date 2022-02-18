const sf = require('./helpers');

const commands = {};

commands.ping = async (message) => {
	await message.reply(`${Math.round(bot.ws.ping)}ms pong.`);
};

commands.version = async (message) => {
	await message.reply('Version: 3.0');
};

commands.admin_help = async (message) => {
	await message.reply([
		'```',
		'$ping',
		'$version',
		'$admin_help',
		'$user_help',
		'$update_nickname',
		'$update_nickname_with_id [Integer] [String]',
		'Your status_update should be enclosed in three backticks so that it gets recorded by the bot.',
		'$stats [@mention(optional)]',
		'$weekly_stats_all',
		'$take_leave',
		'$show_all_ids',
		'$show_id [Integer]',
		'$edit_user [@mention(optional)] [Integer] [Integer] - sum of both the integers should be less than or equal to seven.',
		'$change_weekly_reset_day_number [Integer] - a number from 0 to 6',
		'$edit_id [Integer] [Integer] [Integer] - sum of the last two integers should be less than or equal to seven.',
		'$add_user [@mention(optional)]',
		'$add_id [Integer]',
		'$get_meeting_absentees_list',
		'$total_reset',
		'$weekly_reset',
		'$monthly_reset',
		'$delete_user [@mention(optional)]',
		'$delete_all',
		'$delete_id [Integer]',
		'$backup',
		'$delete_backup',
		'$load_backup',
		'$shutdown',
		'```'
	].join('\n'));
};

commands.user_help = async (message) => {
	await message.reply([
		'```',
		'$ping',
		'$version',
		'$help',
		'$update_nickname',
		'Your status_update should be enclosed in three backticks so that it gets recorded by the bot.',
		'$stats [@mention(optional)]',
		'$weekly_stats_all',
		'$take_leave',
		'$get_meeting_absentees_list',
		'```'
	].join('\n'));
};

commands.update_nickname = async (message) => {
	const user = message.author;
	const guild = message.member;
	if (db[user.id]) {
		db[user.id].display_name = guild.displayName;
		await message.react(done_character);
	} else {
		await message.reply('No record found on you.');
	}
};

commands.update_nickname_with_id = async (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 3 && split_message[1].length && split_message[2].length < max_characters) {
		if (db[split_message[1]]) {
			db[split_message[1]].display_name = split_message[2];
			await message.react(done_character);
		} else {
			await message.reply('No entry found.');
		}
	} else {
		await message.reply('Command should have 2 arguments whose size is less than', max_characters, '.');
	}
};

commands.status_update = async (message) => {
	if (message.content.startsWith('```') && message.content.endsWith('```')) {
		const user = message.author;
		const guild = message.member;
		if (db[user.id]) {
			if (db[user.id].weekly_updates_count < 7) {
				db[user.id].weekly_updates_count += 1;
				db[user.id].monthly_updates_count += 1;
				await message.react(done_character);
			} else {
				await message.react(fail_character);
				await message.reply('Are you stupid, how can you put more than 7 status updates in a week.');
			}
		} else {
			db[user.id] = {
				display_name: guild.displayName,
				weekly_updates_count: 1,
				monthly_updates_count: 1,
				total_leaves: 0,
				leaves: 0
			};
			await message.react(created_character);
			await message.react(done_character);
		}
	}
};

commands.take_leave = async (message) => {
	const user = message.author;
	if (db[user.id]) {
		if (db[user.id].leaves < (7 - db[user.id].weekly_updates_count)) {
			db[user.id].leaves += 1;
			db[user.id].total_leaves += 1;
			await message.react(done_character);
		} else {
			await message.react(fail_character);
			await message.reply('Are you stupid. How can you take more leaves in the remaining number of days in a week.');
		}
	} else {
		db[user.id] = {
			display_name: message.member.displayName,
			weekly_updates_count: 0,
			monthly_updates_count: 0,
			total_leaves: 1,
			leaves: 1
		};
		await message.react(done_character);
	}
};

commands.weekly_stats_all = async (message) => {
	if (Object.keys(db).length == 0) {
		await message.reply('No entries recorded.');
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
		await message.reply(`\`\`\`${reply_message}\`\`\``);
	}
};

commands.show_all_ids = async (message) => {
	if (Object.keys(db).length == 0) {
		await message.reply('No entries recorded.');
	} else {
		let reply_message = '';
		for (const [key, value] of Object.entries(db)) {
			reply_message += `${key} ${arrow_character} ${value.display_name}${value_differentiating_character} Weekly - ${value.weekly_updates_count} & Monthly - ${value.monthly_updates_count} & Leaves - ${value.leaves} & Total Leaves - ${value.total_leaves}\n`;
		}
		await message.channel.send(`\`\`\`${reply_message}\`\`\``);
	}
};

commands.show_id = async (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 2) {
		if (db[split_message[1]]) {
			const value = db[split_message[1]];
			await message.reply(`\`\`\`${split_message[1]} ${arrow_character} ${value.display_name}${value_differentiating_character} Weekly - ${value.weekly_updates_count} & Monthly - ${value.monthly_updates_count} & Leaves - ${value.leaves} & Total Leaves - ${value.total_leaves}\`\`\``);
		} else {
			await message.reply('No entries recorded.');
		}
	} else {
		await message.reply('Command accepts 1 argument.');
	}
};

commands.stats = async (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 1 || split_message.length == 2) {
		if (Object.keys(db).length == 0) {
			await message.reply('No entries recorded.');
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
			await message.reply(`\`\`\`${reply_message}\`\`\``);
		}
	} else {
		await message.reply('Command accept only 1 argument.');
	}
};

commands.edit_user = async (message) => {
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
						await message.react(done_character);
					} else {
						await message.reply('Weekly updates and leaves must sum up to seven.');
					}
				} else {
					await message.reply('Weekly updates value exceeds 7 or is less than 0.');
				}
			} catch (error) {
				await message.reply('You entered non integer values for any one of the 3 arguments required.');
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
						await message.react(done_character);
					} else {
						await message.reply('Weekly updates and leaves must sum up to seven.');
					}
				} else {
					await message.reply('Weekly updates value exceeds 7 or is less than 0.');
				}
			} catch (error) {
				await message.reply('You entered non integer values for any one of the 3 arguments required.');
			}
		}
	} else {
		await message.reply('Command accepts 2 or 3 arguments.');
	}
};

commands.change_weekly_reset_day_number = async (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 2) {
		let x = 0;
		let bool = false;
		try {
			x = parseInt(split_message[1]);
			if (x >= 0 && x <= 6) {
				bool = true;
			} else {
				await message.reply('You entered wrong number. The range is from 0 to 6.');
			}
		} catch (error) {
			await message.reply('You entered wrong number. The range is from 0 to 6.');
		}
		if (bool) {
			weekly_reset_day_number = x;
		}
	} else {
		await message.reply('Command accepts 1 argument.');
	}
};

commands.edit_id = async (message) => {
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
						await message.react(done_character);
					} else {
						await message.reply('Weekly updates and leaves must sum less than or equal to seven.');
					}
				} else {
					await message.reply('Weekly updates value exceeds 7 or is less than 0.');
				}
			} catch (error) {
				await message.reply('You entered non integer values for any one of the 3 arguments required.');
			}
		} else {
			await message.reply('No record found.');
		}
	} else {
		await message.reply('Command accepts 3 arguments.');
	}
};

commands.add_user = async (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 1 || split_message.length == 2) {
		if (message.mentions.users.first() == undefined) {
			const user = message.author;
			if (!db[user.id]) {
				db[user.id] = {
					display_name: message.member.displayName,
					monthly_updates_count: 0,
					weekly_updates_count: 0,
					leaves: 0,
					total_leaves: 0
				};
			}
		} else {
			const mentioned_user = message.mentions.users.first();
			if (!db[mentioned_user.id]) {
				db[mentioned_user.id] = {
					display_name: '',
					monthly_updates_count: 0,
					weekly_updates_count: 0,
					leaves: 0,
					total_leaves: 0
				};
			}
		}
		await message.react(done_character);
	} else {
		await message.reply('Command accepts only 1 argument at max.');
	}
};

commands.add_id = async (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 2) {
		if (!db[split_message[1]]) {
			db[split_message[1]] = {
				display_name: '',
				monthly_updates_count: 0,
				weekly_updates_count: 0,
				leaves: 0,
				total_leaves: 0
			};
		}
		await message.react(done_character);
	} else {
		await message.reply('Commands accepts only 1 argument.');
	}
};

commands.get_meeting_absentees_list = async (message) => {
	const guild = bot.guilds.cache.get(server_id);
	let member = null;
	let reply_message = '***The following list of members are absent.***\n';
	for (const key of Object.keys(db)) {
		member = guild.members.cache.get(key);
		if (!member?.voice?.channel) {
			reply_message += '<@{member.id}>\n';
		}
	}
	await message.reply(reply_message);
};

commands.total_reset = async (message) => {
	for (const key of Object.keys(db)) {
		db[key].monthly_updates_count = 0;
		db[key].weekly_updates_count = 0;
		db[key].leaves = 0;
		db[key].total_leaves = 0;
	}
	await message.react(done_character);
};

commands.monthly_reset = async (message) => {
	for (const key of Object.keys(db)) {
		db[key].monthly_updates_count = 0;
		db[key].total_leaves = 0;
	}
	await message.react(done_character);
};

commands.weekly_reset = async (message) => {
	for (const key of Object.keys(db)) {
		db[key].weekly_updates_count = 0;
		db[key].leaves = 0;
	}
	await message.react(done_character);
};

commands.delete_user = async (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 1 || split_message.length == 2) {
		if (message.mentions.users.first() === undefined) {
			delete db[message.author.id];
		} else {
			delete db[message.mentions.users.first().id];
		}
		await message.react(done_character);
	} else {
		await message.reply('Command accepts only 1 argument.');
	}
};

commands.delete_id = async (message) => {
	const split_message = message.content.split(' ');
	if (split_message.length == 2) {
		if (db[split_message[1]]) {
			delete db[split_message[1]];
			await message.react(done_character);
		} else {
			await message.reply('No record for that particular id found.');
		}
	} else {
		await message.reply('Command accepts 1 argument.');
	}
};

commands.delete_all = async (message) => {
	db = {};
	await message.react(done_character);
};

commands.backup = async (message) => {
	if (sf.backup()) {
		await message.react(done_character);
	} else {
		await message.reply('Backup creation failed. Please consult the bot-dev once about this message.');
	}
};

commands.delete_backup = async (message) => {
	if (sf.delete_backup()) {
		await message.react(done_character);
	} else {
		await message.reply('Backup delete failed. Please consult the bot-dev once about this message.');
	}
};

commands.load_backup = async (message) => {
	if (sf.load_backup()) {
		await message.react(done_character);
	} else {
		await message.reply('Backup loading failed. Please consult the bot-dev once about this message.');
	}
};

commands.shutdown = async (message) => {
	if (sf.backup()) {
		await message.react(done_character);
	} else {
		await message.reply('Backup failed.');
	}
	await message.reply('Bot is shutting down.');
	clearInterval(interval);
	bot.destroy();
	process.exit();
};

module.exports = commands;
