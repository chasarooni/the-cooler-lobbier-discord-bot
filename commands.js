import Discord from "discord.js";

import emojis from "./emojis.js";

export const defaultMessage = (supportedGames) => {
  return new Discord.MessageEmbed()
    .setColor("#669900")
    .attachFiles(["./img/lobbyist.png"])
    .setAuthor("Lobbyist", "attachment://lobbyist.png")
    .setTitle("Lobby creator")
    .setDescription("Type 'lobby <command> or lobby <game> <time>' to create a game lobby")
    .addField(
      "Available commands:",
      `${supportedGames
        .map((game) => `${game.name} - ${game.displayName}`)
        .join("\n")}\n\n${
        emojis.clock
      } Each lobby is valid for 30 days or until lobby creator removes it\n\n${
        emojis.smiley
      } [Add The Cooler Lobbyer to your server](https://discord.com/oauth2/authorize?client_id=715256255714689136&scope=bot&permissions=0 'do it')`,
      true
    );
};

export const lobbyMessage = (game, players, starttime) => {
  const { displayName, name, size } = game;

  return new Discord.MessageEmbed()
    .setColor("#669900")
    .attachFiles(["./img/lobbyist.png", `./img/${name}.png`])
    .setThumbnail(`attachment://${name}.png`)
    .setAuthor("The Cooler Lobbyer", "attachment://lobbyist.png")
    .setTitle(`${displayName} lobby for ${starttime}`)
    .addField("--------------------------", createLobbyList(size, players))
    .addField(
      `--------------------------`,
      `react with ${emojis.thumbsUp} to join the lobby\n\nreact with ${emojis.thumbsDown} to leave the lobby\n\nlobby creator react with ${emojis.checkMark} to ping players`
    );
};

export const startMessage = (game, players) => {
  game.displayName = game.name === "custom" ? "" : game.displayName;
  const { name, displayName, size } = game;

  players.slice(0, size - 1);

  return `Time to play ${displayName} ${players
    .map((player) => `<@${player}>`)
    .join(" ")}`;
};

export const cancelMessage = () => "lobby cancelled";

const createLobbyList = (size, players) => {
  let text = "";
  for (let i = 0; i < size; i++) {
    text += `${emojis[i + 1]} `;

    if (players[i]) {
      text += `<@${players[i]}>`;
    }

    if (i + 1 !== size) {
      text += `\n`;
    }
  }

  return text;
};
