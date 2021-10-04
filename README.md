## status_updates_bot

This a discord bot which can be used to monitor status updates.


## Setup

Requirements : Nodejs
```bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -;
sudo apt update;
sudo apt-get install -y nodejs npm;
npm install dotenv fs discord.js;
sudo npm install -g npm@latest;
```
Create a .env file, add the following line in it:-
```
CLIENT_TOKEN='<API Token>'
```
First install all the dependencies related required using the following command:-
```bash
npm install
```

To run the application execute the command:-
```bash
node index.js
```

## Running the bot in the background.

Use forever package from npm.


```bash
sudo npm install -g forever
forever start index.js
```

