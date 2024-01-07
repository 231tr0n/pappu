# Pappu

This a discord bot which can be used to monitor status updates.

## Setup

Requirements : Nodejs<br>
Create a .env file, add the following lines in it and change the password to the one which you put:-

```
client_token='<API Token>'
db_host='localhost'
db_name='pappu'
db_username='pappu'
db_password='*******'
server_id='999999999999999999'
status_updates_channels='999999999999999999,9999999999999999998'
admin_commands_channels='999999999999999999,9999999999999999998'
logs_channels='999999999999999999,9999999999999999998'
```

`admin_commands_channels`, `logs_channels` and `status_updates_channels` are multivauled fields which accept comma seperated values.<br>
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
npx forever start index.js
```
