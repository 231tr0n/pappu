const fs = require('fs');

const commands = {};

commands.backup = () => {
	let temp = true;
	try {
		fs.writeFileSync(backup_file_name, JSON.stringify(db, null, 4));
	} catch (error) {
		console.log('-------------------------------------------------------');
		console.log(error);
		console.log('-------------------------------------------------------');
		temp = false;
	}
	return temp;
};

commands.load_backup = () => {
	let temp = true;
	try {
		if (fs.existsSync(backup_file_name)) {
			const data = fs.readFileSync(backup_file_name, 'utf8');
			db = JSON.parse(data);
		} else {
			fs.writeFileSync(backup_file_name, JSON.stringify({}, null, 4));
			db = {};
		}
	} catch (error) {
		console.log('-------------------------------------------------------');
		console.log(error);
		console.log('-------------------------------------------------------');
		temp = false;
	}
	return temp;
};

commands.delete_backup = () => {
	let temp = true;
	try {
		fs.writeFileSync(backup_file_name, JSON.stringify({}, null, 4));
		db = {};
	} catch (error) {
		console.log('-------------------------------------------------------');
		console.log(error);
		console.log('-------------------------------------------------------');
		temp = false;
	}
	return temp;
};

module.exports = commands;
