const global_variables = require('./global_variables.js');
const fs = require('fs');

let backup = () => {
	let temp = true;
	let json_string = {};
	let json_string_1 = {};
	for (let key of global_variables.hash_map.keys()) {
		json_string[key] = global_variables.hash_map.get(key);
	}
	for (let key of global_variables.name_map.keys()) {
		json_string_1[key] = global_variables.name_map.get(key);
	}
	try {
		fs.writeFileSync('./hash_map_data.json', JSON.stringify(json_string));
		fs.writeFileSync('./name_map_data.json', JSON.stringify(json_string_1));
	} catch(error) {
		console.log(error);
		temp = false;
	}
	return temp;
}

let load_backup = () => {
	let temp = true;
	try {
		let data = fs.readFileSync('./hash_map_data.json', 'utf8');
		let data_1 = fs.readFileSync('./name_map_data.json', 'utf8');
		let json_string = JSON.parse(data);
		let json_string_1 = JSON.parse(data_1);
		global_variables.hash_map.clear();
		global_variables.name_map.clear();
		for (let key in json_string) {
			global_variables.hash_map.set(key, json_string[key]);
		}
		for (let key in json_string_1) {
			global_variables.name_map.set(key, json_string_1[key]);
		}
	} catch(error) {
		console.log(error);
		temp = false;
	}
	return temp;
}

module.exports = {
	backup,
	load_backup
}
