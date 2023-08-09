## Pappu

This a discord bot which can be used to monitor status updates.


## Setup

Requirements : Nodejs and Mariadb

Change the password for the username which is going to be created in database.sql file.
```
sudo mariadb -u root -p < database.sql;
```

Create a .env file, add the following lines in it and change the password to the one which you put:-
```
client_token='<API Token>'
db_host='localhost'
db_name='pappu'
db_user='pappu'
db_password='***********'
```

Go to the config.js file and change the following according to your own server:-
```js
global.server_id = '953989939241025577';
global.status_updates_channels = [
	'953990515563593768'
];
global.admin_commands_channels = [
	'953990540603588639'
];
global._logs_channels = [
	'953990540603588639'
];
```
`global.admin_commands_channels`, `global.logs_channels` and `global.status_updates_channels` are arrays which can be provided with multiple channels ids and the bot will work on all those channels.

First navigate to the project root folder and install all the dependencies related required using the following command:-
```bash
npm install
```

To run the application execute the command:-
```bash
node .
```

## Running the bot in the background.

Use forever package from npm.


```bash
sudo npm install --save-dev forever
npx forever start index.js
```
