import Discord from "discord.js";
import dotenv from "dotenv";

import supportedGames from "./supportedGames.js";
import emojis from "./emojis.js";

import {
  defaultMessage,
  lobbyMessage,
  startMessage,
  cancelMessage,
} from "./commands.js";

function reminder() {
  await reactionCollector.stop();
  await message.channel.send(startMessage(game, players));
}
dotenv.config({ path: "./.env" });

const client = new Discord.Client();

client.once("ready", () => {
  console.log("Bot ready...");
  console.log(`Bot available in ${client.guilds.cache.size} guilds`);
  client.user.setActivity(`type 'lobby'`);
});

client.on("message", async (message) => {
  const prefix = process.env.DISCORD_PREFIX;

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  try {
    // get command arguments
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args[1];

    // send default command
    if (!command) {
      await message.channel.send(defaultMessage(supportedGames));

      return;
    }

    // check if command is supported
    const filteredGames = supportedGames.filter(
      (game) => game.name === command
    );
    if (!filteredGames.length) return;

    // prepare game object and players array
    const game = filteredGames[0];

    /*if (game.name === "custom") {
      let size = +args[2];
      if (!Number.isInteger(size)) return;
      if (size > 10) size = 10;

      game.size = size;
    }*/
    const starttime = args[2];
    if (starttime) {
      try {
        var f_d = new Date(starttime);
      } catch (err) {
        await message.channel.send("Invalid Date, Try the Format: 2/3/20 15:30 EST");
      }
      const count = f_d.getTime() - Date.now();
      mytime = setTimeout(reminder, count);
    }
    if (user.id === players[0]) {
      await reactionCollector.stop();
      await message.channel.send(startMessage(game, players));
    }

    let players = [message.author.id];

    // send an initial lobby message
    if (!starttime) {
      const lobby = await message.channel.send(lobbyMessage(game, players, ""));
    } else {
      const lobby = await message.channel.send(lobbyMessage(game, players, starttime));
    }
    

    // react on the lobby message
    await lobby.react(emojis.thumbsUp);
    await lobby.react(emojis.thumbsDown);
    await lobby.react(emojis.checkMark);

    // setup a reactions collector for the lobby message
    const filter = (reaction, user) =>
      [emojis.thumbsUp, emojis.thumbsDown, emojis.checkMark].includes(
        reaction.emoji.name
      ) && !user.bot;

    const reactionCollector = lobby.createReactionCollector(filter, {
      time: 2592000000,
    });

    reactionCollector.on("collect", async (reaction, user) => {
      // add user to players list
      if (reaction.emoji.name === emojis.thumbsUp) {
        if (!players.includes(user.id)) {
          players.push(user.id);

          await lobby.edit(lobbyMessage(game, players));
        }

        // remove user from players list or cancel the lobby
      } else if (reaction.emoji.name === emojis.thumbsDown) {
        if (user.id === players[0]) {
          await reactionCollector.stop();
          await lobby.delete();
          await message.channel.send(cancelMessage());
        } else if (players.includes(user.id)) {
          players = players.filter((player) => player !== user.id);

          await lobby.edit(lobbyMessage(game, players));
        }

        // mention players
      } else if (reaction.emoji.name === emojis.checkMark) {
        if (user.id === players[0]) {
          await reactionCollector.stop();
          await message.channel.send(startMessage(game, players));
        }
      }
    });

    reactionCollector.on("end", (collected) =>
      console.log(
        `Lobby watcher ended. Collected ${collected.size} reaction(s)...`
      )
    );
  } catch (err) {
    console.log(err);
  }
});

client.login(process.env.DISCORD_TOKEN);
