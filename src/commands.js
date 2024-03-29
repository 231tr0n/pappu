import database from "./database.js";
import models from "./models.js";
import utils from "./utils.js";

const commands = {};

commands.ping = {
  type: ["user", "admin"],
  description: "Shows ping",
  handler: async (message) => {
    message.reply(`${Math.round(bot.ws.ping)}ms pong.`);
  },
};

commands.help = {
  type: ["user", "admin"],
  description: "Shows help",
  handler: async (message) => {
    let temp = "```";
    for (const i in commands) {
      if (status_updates_channels.includes(message.channel.id)) {
        if (commands[i].type.includes("user")) {
          temp += `${i}: ${commands[i].description}\n`;
        }
      } else if (admin_commands_channels.includes(message.channel.id)) {
        if (commands[i].type.includes("admin")) {
          temp += `${i}: ${commands[i].description}\n`;
        }
      }
    }
    temp += "```";
    message.reply(temp);
  },
};

commands.status_update = {
  type: ["user"],
  description: "Puts status update",
  handler: async (message) => {
    await models.insert_status(message.author.id, models.statuses.update);
  },
};

commands.take_holiday = {
  type: ["user"],
  description: "Puts holiday",
  handler: async (message) => {
    await models.insert_status(message.author.id, models.statuses.holiday);
  },
};

commands.query = {
  type: ["admin"],
  description: "Lets you execute a query in the database",
  handler: async (message) => {
    let message_content = null;
    if (message.content.split(" ")[0] === `${bot_command_initiator}query`) {
      message_content = message.content.split(" ").slice(1).join(" ");
    } else {
      message_content = message.content.replaceAll("```", "");
    }
    database
      .query(message_content)
      .then((results) => {
        message.reply(`\`\`\`${JSON.stringify(results, null, 4)}\`\`\``);
      })
      .catch((error) => {
        message.reply(`\`\`\`${JSON.stringify(error, null, 4)}\`\`\``);
        message.react(fail_character);
      });
  },
};

commands.modify_update = {
  type: ["admin"],
  description:
    "Updates a user's status update ([@user], [status(update|no_update|holiday)] [date(yyyy-mm-dd)(optional)])",
  handler: async (message) => {
    let params = message.content.split(" ");
    params = params.filter((x) => x && x !== "");
    if (params.length > 3 && !utils.verify_date(params[3])) {
      message.reply("wrong date format passed");
      message.react(fail_character);
      return;
    }
    if (
      params.length < 3 ||
      !utils.verify_status(params[2]) ||
      !message.mentions.users.first()
    ) {
      message.reply("wrong parameters passed");
      message.react(fail_character);
      return;
    }
    if (params[2] === "holiday") {
      if (params.length > 3) {
        await models.upsert_status(
          message.mentions.users.first().id,
          models.statuses.holiday,
          params[3],
        );
        return;
      }
      await models.upsert_status(
        message.mentions.users.first().id,
        models.statuses.holiday,
      );
      return;
    }
    if (params[2] === "update") {
      if (params.length > 3) {
        await models.upsert_status(
          message.mentions.users.first().id,
          models.statuses.update,
          params[3],
        );
        return;
      }
      await models.upsert_status(
        message.mentions.users.first().id,
        models.statuses.update,
      );
      return;
    }
    if (params.length > 3) {
      await models.upsert_status(
        message.mentions.users.first().id,
        models.statuses.no_update,
        params[3],
      );
      return;
    }
    await models.upsert_status(
      message.mentions.users.first().id,
      models.statuses.no_update,
    );
  },
};

commands.add_date = {
  type: ["admin"],
  description: "Add a date to the database ([date(yyyy-mm-dd)(optional)])",
  handler: async (message) => {
    let params = message.content.split(" ");
    params = params.filter((x) => x && x !== "");
    if (params.length > 1) {
      if (!utils.verify_date(params[1])) {
        message.reply("wrong date format passed");
        message.react(fail_character);
        return;
      }
      await models.insert_date(params[1]);
      return;
    }
    await models.insert_date();
  },
};

commands.delete_date = {
  type: ["admin"],
  description: "Delete a date in the database ([date(yyyy-mm-dd)(optional)])",
  handler: async (message) => {
    let params = message.content.split(" ");
    params = params.filter((x) => x && x !== "");
    if (params.length > 1) {
      if (!utils.verify_date(params[1])) {
        message.reply("wrong date format passed");
        message.react(fail_character);
        return;
      }
      await models.delete_date(params[1]);
      return;
    }
    await models.delete_date();
  },
};

commands.get_updates = {
  type: ["admin"],
  description:
    "Prints all status updates in a given duration ([start_date(yyyy-mm-dd)(optional)] [end_date(yyyy-mm-dd)(optional)])",
  handler: async (message) => {
    let params = message.content.split(" ");
    params = params.filter((x) => x && x !== "");
    let start_date = null;
    let end_date = null;
    if (params.length < 2) {
      start_date = new Date();
      end_date = new Date();
    } else if (params.length === 2 && utils.verify_date(params[1])) {
      start_date = new Date(params[1]);
      end_date = new Date(params[1]);
    } else if (
      params.length > 2 &&
      utils.verify_date(params[1]) &&
      utils.verify_date(params[2])
    ) {
      start_date = new Date(params[1]);
      end_date = new Date(params[2]);
    } else {
      message.reply("wrong date format passed");
      message.react(fail_character);
      return;
    }
    let output = "-------------\n";
    for (
      let loop = new Date(start_date);
      loop <= end_date;
      loop.setDate(loop.getDate() + 1)
    ) {
      const pdate = `${loop.getFullYear()}-${`0${loop.getMonth() + 1}`.slice(-2)}-${`0${loop.getDate()}`.slice(-2)}`;
      const res = await models.get_statuses_on_date(pdate);
      if (res) {
        output += "-------------\n";
        output += `***${pdate}***\n`;
        output += "\t\t\t\t**Update**\n";
        for (const n of res.update) {
          output += `\t\t\t\t\t\t\t\t<@${n}>\n`;
        }
        output += "\t\t\t\t**Holiday**\n";
        for (const n of res.holiday) {
          output += `\t\t\t\t\t\t\t\t<@${n}>\n`;
        }
      }
    }
    message.reply(output);
  },
};

commands.get_update = {
  type: ["user", "admin"],
  description:
    "Prints status update of a user at a given duration ([@user] [date(yyyy-mm-dd)(optional)])",
  handler: async (message) => {
    let params = message.content.split(" ");
    params = params.filter((x) => x && x !== "");
    if (params.length > 2) {
      if (!utils.verify_date(params[2])) {
        message.reply("wrong date format passed");
        message.react(fail_character);
        return;
      }
    }
    if (params.length < 2 || !message.mentions.users.first()) {
      message.reply("wrong parameters passed");
      message.react(fail_character);
      return;
    }
    let ret = null;
    if (params.length > 2) {
      ret = await models.get_status_of_id_on_date(
        message.mentions.users.first().id,
        params[2],
      );
    } else {
      ret = await models.get_status_of_id_on_date(
        message.mentions.users.first().id,
      );
    }
    if (ret === models.statuses.update) {
      message.reply("Update");
    } else if (ret === models.statuses.holiday) {
      message.reply("Holiday");
    } else {
      message.reply("No Update");
    }
  },
};

commands.shutdown = {
  type: ["admin"],
  description: "Shuts down the bot",
  handler: async () => {
    process.kill(process.pid, "SIGTERM");
  },
};

export default commands;
