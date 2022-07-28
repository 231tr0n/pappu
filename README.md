## Pappu

This a discord bot which can be used to monitor status updates.


## Setup

Requirements : Nodejs
```bash
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -;
sudo apt update;
sudo apt-get install -y nodejs;
sudo npm install -g npm@latest;
```
Create a .env file, add the following line in it:-
```
CLIENT_TOKEN='<API Token>'
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
```
`global.admin_commands_channels` and `global.status_updates_channels` are arrays which can be provided with multiple channels ids and the bot will work on all those channels.

First navigate to the project root folder and install all the dependencies related required using the following command:-
```bash
npm install
npm install -D
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
