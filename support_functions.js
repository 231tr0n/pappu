const global_variables = require('./global_variables.js');
const fs = require('fs');

let backup = () => {
	let temp = true;
	let json_string = {};
	for (let key of global_variables.hash_map.keys()) {
		json_string[key] = global_variables.hash_map.get(key);
	}
	try {
		fs.writeFileSync(global_variables.backup_file_name, JSON.stringify(json_string, null, 4));
	} catch(error) {
		console.log('-------------------------------------------------------');
		console.log(error);
		console.log('-------------------------------------------------------');
		temp = false;
	}
	return temp;
}

let load_backup = () => {
	let temp = true;
	try {
		if (fs.existsSync(global_variables.backup_file_name)) {
			let data = fs.readFileSync(global_variables.backup_file_name, 'utf8');
			let json_string = JSON.parse(data);
			global_variables.hash_map.clear();
			for (let key in json_string) {
				global_variables.hash_map.set(key, json_string[key]);
			}
		} else {
			fs.writeFileSync(global_variables.backup_file_name, JSON.stringify({}, null, 4));
			global_variables.hash_map.clear();
		}
	} catch(error) {
		console.log('-------------------------------------------------------');
		console.log(error);
		console.log('-------------------------------------------------------');
		temp = false;
	}
	return temp;
}

let delete_backup = () => {
	let temp = true;
	try {
		fs.writeFileSync(global_variables.backup_file_name, JSON.stringify({}, null, 4));
		global_variables.hash_map.clear();
	} catch(error) {
		console.log('-------------------------------------------------------');
		console.log(error);
		console.log('-------------------------------------------------------');
		temp = false;
	}
	return temp;
}

module.exports = {
	backup,
	load_backup,
	delete_backup
}
