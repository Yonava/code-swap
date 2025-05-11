import chalk from "chalk";

export const LOCALHOST_PORT = 3004;

export const PORT = process.env.PORT || LOCALHOST_PORT;

export const LOG_COLORS = {
  error: chalk.bold.red,
  success: chalk.bold.green,
  info: chalk.bold.blue,
  warning: chalk.bold.yellow,
  debug: chalk.bold.cyan,

  socketId: chalk.bold.yellow,
  playerId: chalk.bold.green,
  matchId: chalk.bold.magenta,
  channel: chalk.bold.blue,
};
