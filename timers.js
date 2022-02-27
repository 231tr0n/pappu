global.interval = setInterval(async () => {
	try {
		const date = new Date();
		if (date.getHours() == 0 && date.getMinutes == 0 && date.getSeconds == 0) {
			let reply_message = '';
			if (date.getDay() == weekly_reset_day_number) {
				reply_message = '';
				if (Object.keys(db).length == 0) {
					reply_message = 'No entries recorded.';
				} else {
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
				}
				for (const key of Object.keys(db)) {
					db[key].weekly_updates_count = 0;
					db[key].leaves = 0;
				}
				for (const id of admin_commands_channels) {
					await bot.channels.cache.get(id).send(`Weekly reset has been done.\n${reply_message}`);
				}
			}
			if (date.getDate() == 1) {
				reply_message = '';
				if (Object.keys(db).length == 0) {
					reply_message = 'No entries recorded.';
				} else {
					for (const [key, value] of Object.entries(db)) {
						reply_message += `${key} ${arrow_character} ${value.display_name}${value_differentiating_character} Weekly - ${value.weekly_updates_count} & Monthly - ${value.monthly_updates_count} & Leaves - ${value.leaves} & Total Leaves - ${value.total_leaves}\n`;
					}
				}
				for (const key of Object.keys(db)) {
					db[key].monthly_updates_count = 0;
					db[key].total_leaves = 0;
				}
				for (const id of admin_commands_channels) {
					await bot.channels.cache.get(id).send(`Monthly reset has been done.\n${reply_message}`);
				}
			}
		}
	} catch (error) {
		console.log('-------------------------------------------------------');
		console.log(error);
		console.log('-------------------------------------------------------');
		for (const id of admin_commands_channels) {
			await bot.channels.cache.get(id).send('Bot\'s brain screw has become loose. Error occured with the bot. Please consult the bot-dev once about this message.');
		}
	}
}, 1000);
