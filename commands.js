const utils = require('./utils');
const database = require('./database');
const models = require('./models');

const commands = {};

commands.ping = {
	type: ['user', 'admin'],
	description: 'Shows ping',
	handler: async (message) => {
		message.reply(`${Math.round(bot.ws.ping)}ms pong.`);
	}
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
	}
};

commands.status_update = {
	type: ['user'],
	description: 'Shows status update of the user',
	handler: async (message) => {
		await models.status_updates.insert_entry(message.author.id, '1');
		message.react(done_character);
	}
};

commands.take_leave = {
	type: ['user'],
	description: 'User can take a leave',
	handler: async (message) => {
		await models.status_updates.insert_entry(message.author.id, '0');
		message.react(done_character);
	}
};

commands.update_alias = {
	type: ['user'],
	description: 'Change user alias',
	handler: async (message) => {
		const split_message = message.content.split(' ');
		if (split_message.length == 2) {
			if (split_message[1].length > 99) {
				message.reply('Alias should be lesser than 90 characters.');
			} else {
				await models.aliases.update_entry(message.author.id, split_message[1]);
				message.react(done_character);
			}
		} else {
			message.reply('Command accepts only 1 argument.');
		}
	}
};

commands.query = {
	type: ['admin'],
	description: 'Lets you execute a query in the database',
	handler: async (message) => {
		if (message.content.startsWith('```') && message.content.endsWith('```')) {
			const message_content = message.content.replaceAll('```', '');
			database.query(message_content).then(async (results) => {
				message.reply(`\`\`\`${JSON.stringify(results, null, 4)}\`\`\``);
				message.react(done_character);
			}).catch(async (error) => {
				message.reply(`\`\`\`${JSON.stringify(error, null, 4)}\`\`\``);
			});
		}
	}
};

commands.get_meeting_absentees_list = {
	type: ['user', 'admin'],
	description: 'Gets the list of members who are absent from the meeting',
	handler: async (message) => {
		const guild = bot.guilds.cache.get(server_id);
		let member = null;
		const results = await models.aliases.get_entries();
		let reply_message = '***The following list of members are absent.***\n';
		for (const i of results) {
			if (guild.members.cache.get(i.id)) {
				member = guild.members.cache.get(i.id);
				if (!member?.voice?.channel) {
					reply_message += `<@${member.id}>\n`;
				}
			}
		}
		message.reply(reply_message);
	}
};

commands.backup = {
	type: ['admin'],
	description: 'Backs up the database',
	handler: async (message) => {
		await utils.backup();
		message.react(done_character);
	}
};

commands.load_backup = {
	type: ['admin'],
	description: 'Backs up the database',
	handler: async (message) => {
		await utils.load_backup();
		message.react(done_character);
	}
};

commands.shutdown = {
	type: ['admin'],
	description: 'Shuts down the bot',
	handler: async (message) => {
		await utils.backup();
		await database.end();
		await message.react(done_character);
		bot.destroy();
		process.exit();
	}
};

module.exports = commands;
