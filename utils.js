const fs = require('fs');
const models = require('./models');

const utils = {};

utils.backup = async () => {
	const json = {};
	await models.status_updates.get_entries().then((results) => {
		json.status_updates = results;
	});
	await models.recruitment.get_entries().then((results) => {
		json.recruitment = results;
	});
	await models.aliases.get_entries().then((results) => {
		json.aliases = results;
	});
	fs.rmSync(backup_file_name);
	fs.writeFileSync(backup_file_name, JSON.stringify(json, null, 4));
};

utils.load_backup = async () => {
	if (fs.existsSync(backup_file_name)) {
		const json = fs.readFileSync(backup_file_name, 'utf-8');
		for (const i of json.status_updates) {
			await models.status_updates.update_entry(i.id, i.update, i.date);
		}
		for (const i of json.aliases) {
			await models.aliases.update_entry(i.id, i.alias);
		}
		for (const i of json.recruitment) {
			await models.recruitment.update_entry(i.id, i.git_repository, i.submission_data, i.date);
		}
	}
};

module.exports = utils;
