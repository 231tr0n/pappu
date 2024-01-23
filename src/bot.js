import "./config.js";

import discord from "discord.js";

import utils from "./utils.js";
import models from "./models.js";
import commands from "./commands.js";
import database from "./database.js";

global.bot = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildVoiceStates,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.GuildMessageReactions,
    discord.GatewayIntentBits.DirectMessages,
    discord.GatewayIntentBits.DirectMessageReactions,
    discord.GatewayIntentBits.GuildEmojisAndStickers,
    discord.GatewayIntentBits.GuildMessageTyping,
    discord.GatewayIntentBits.DirectMessageTyping,
    discord.GatewayIntentBits.GuildPresences,
    discord.GatewayIntentBits.GuildMembers,
    discord.GatewayIntentBits.MessageContent,
    discord.GatewayIntentBits.GuildInvites,
    discord.GatewayIntentBits.GuildScheduledEvents,
    discord.GatewayIntentBits.GuildWebhooks,
    discord.GatewayIntentBits.GuildModeration,
    discord.GatewayIntentBits.GuildIntegrations,
  ],
});

bot.on("ready", async () => {
  await (async () => {
    try {
      await models.setup();
    } catch (error) {
      console.trace(error);
      process.exit();
    }
  })();
  let guild = null;
  try {
    guild = bot.guilds.cache.get(server_id);
  } catch (error) {
    console.log("Server id you entered doesn't exist.");
    console.trace(error);
    process.exit();
  }
  try {
    await Promise.all([guild.members.fetch(), guild.channels.fetch()]);
  } catch (error) {
    console.log("Unable to fetch guild members or channels.");
    console.trace(error);
    process.exit();
  }
  try {
    await utils.bot.status_updates_channels.broadcast(
      "Hello pappus. Pappu is back with the status update nightmare. I will be patrolling and monitoring you pretty closely. Don't try to evade status updates.",
    );
  } catch (error) {
    console.log("One of the id in status_updates_channels doesn't exist.");
    console.trace(error);
    process.exit();
  }
  try {
    await utils.bot.admin_commands_channels.broadcast("The Bot is online.");
  } catch (error) {
    console.log("One of the id in admin_commands_channels doesn't exist.");
    console.trace(error);
    process.exit();
  }
  try {
    await utils.bot.logs_channels.broadcast("The Bot is online.");
  } catch (error) {
    console.log("One of the id in logs_channels doesn't exist.");
    console.trace(error);
    process.exit();
  }
  console.log(`Logged in as: ${bot.user.tag}`);
});

bot.on("messageCreate", async (message) => {
  try {
    if (message.author.id !== bot.user.id && message?.guild?.id === server_id) {
      if (status_updates_channels.includes(message.channel.id)) {
        if (
          message.content.startsWith("```") &&
          message.content.endsWith("```")
        ) {
          message.react(attended_character);
          commands.status_update.handler(message);
        } else if (message.content.startsWith(bot_command_initiator)) {
          const split_message = message.content.split(" ");
          const command = split_message[0].slice(1);
          if (commands[command]) {
            if (commands[command].type.includes("user")) {
              message.react(attended_character);
              commands[command].handler(message);
            } else {
              message.react(fail_character);
              message.reply(
                "Are you stupid. Stop speaking the language which I dont understand.",
              );
            }
          } else {
            message.react(fail_character);
            message.reply(
              "Are you stupid. Stop speaking the language which I dont understand.",
            );
          }
        }
      } else if (admin_commands_channels.includes(message.channel.id)) {
        if (
          message.content.startsWith("```") &&
          message.content.endsWith("```")
        ) {
          message.react(attended_character);
          commands.query.handler(message);
        } else if (message.content.startsWith(bot_command_initiator)) {
          const split_message = message.content.split(" ");
          const command = split_message[0].slice(1);
          if (commands[command]) {
            if (commands[command].type.includes("admin")) {
              message.react(attended_character);
              commands[command].handler(message);
            } else {
              message.react(fail_character);
              message.reply(
                "Are you stupid. Stop speaking the language which I dont understand.",
              );
            }
          } else {
            message.react(fail_character);
            message.reply(
              "Are you stupid. Stop speaking the language which I dont understand.",
            );
          }
        }
      }
    }
  } catch (error) {
    try {
      await utils.bot.logs_channels.broadcast(
        `@everyone, ${message.id} # ${message.channel.id} # ${
          message.author.id
        }: ${message.content}\n\`\`\`${error.toString()}\`\`\``,
      );
      message.react(repair_character);
      message.reply(
        "Bot's brain screw has become loose. Error occured with the bot. Please consult the bot-devs once about this message.",
      );
    } catch (err) {
      console.trace(err);
    }
  }
});

bot.login(process.env.client_token);

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
  process.on(signal, async () => {
    console.log("SIGINT signal received. Closing the server.");
    try {
      await Promise.all([
        utils.bot.logs_channels.broadcast("Bot is Shutting down."),
        utils.bot.admin_commands_channels.broadcast("Bot is shutting down."),
        utils.bot.status_updates_channels.broadcast(
          "Goodbye pappus. I will be back for revenge with my status updates nightmare.",
        ),
      ]);
      await Promise.all([bot.destroy(), database.close()]);
      console.log("Shutting down.");
      process.exit();
    } catch (error) {
      console.trace(error);
      process.exit();
    }
  });
});
