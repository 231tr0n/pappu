## status_updates_bot

This a discord bot which can be used to monitor status updates.


## Setup

Requirements : Nodejs
```
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

To run the application execute the command:-
```
node index.js
```

## Running the bot in the background.

Use forever package from npm.


```
sudo npm install -g forever
forever start index.js
```
