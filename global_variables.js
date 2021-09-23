let hash_map = new Map();

let max_status_updates_limit = 7;

let backup_file_name = './backup_data.json';

let status_update_character = '🟩';
let no_status_update_character = '🟥';
let arrow_character = '▶'; //→➤
let value_differentiating_character = ':';
let repair_character = '🤖';
let created_character = '➕';
let done_character = '✅';
let fail_character = '❌';
let attended_character = '🟢';
let not_attended_character = '🔴';

let server_id = 701019468725223444;

let status_updates_channel = 871655871577456710;
let admin_commands_channel = 871655959527817227;

let max_characters = 20;

module.exports = {
	hash_map,
	max_status_updates_limit,
	backup_file_name,
	status_update_character,
	no_status_update_character,
	arrow_character,
	value_differentiating_character,
	attended_character,
	done_character,
	fail_character,
	created_character,
	server_id,
	status_updates_channel,
	admin_commands_channel,
	max_characters
}
