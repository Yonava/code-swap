import {
  addPlayerIdSocketIdMapping,
  getAllMappings,
  removePlayerIdSocketIdMapping
} from "./registrationDatabase";
import { socketLogger } from "./socket";
import {
  type PlayerSocketInstance,
  SOCKET_GATEWAY_REGISTRATION_EVENT_NAME
} from "shared-types/dist/socket-gateway";
import chalk from 'chalk';

const register = (socket: PlayerSocketInstance) => socket.on(
  SOCKET_GATEWAY_REGISTRATION_EVENT_NAME,
  async ({ playerId }, ack) => {
    if (!playerId) {
      socketLogger(`${chalk.bold.red('Error!')} On incoming request to ${chalk.bold.blue(SOCKET_GATEWAY_REGISTRATION_EVENT_NAME)}:
  No Player ID Provided - Registration For Socket ID ${chalk.bold.yellow(socket.id)} Failed :(`);
      return;
    }

    await addPlayerIdSocketIdMapping({
      playerId,
      socketId: socket.id
    })
    // maybe add some match lookup logic and create socket rooms matching
    // match id

    const mappings = await getAllMappings();
    socketLogger(SOCKET_GATEWAY_REGISTRATION_EVENT_NAME, mappings);
    socketLogger(`Registered ${chalk.bold.green(playerId)} to ${chalk.bold.yellow(socket.id)}`);

    ack()
  }
)

const unregister = (socket: PlayerSocketInstance) => socket.on(
  'disconnect',
  async () => {
    const playerId = await removePlayerIdSocketIdMapping({
      socketId: socket.id
    })

    if (!playerId) {
      socketLogger(`Unregistered Socket Disconnected with ID: ${chalk.bold.yellow(socket.id)}`);
      return;
    }

    const mappings = await getAllMappings();
    socketLogger(SOCKET_GATEWAY_REGISTRATION_EVENT_NAME, mappings);
    socketLogger(`Unregistered ${chalk.bold.green(playerId)} from ${chalk.bold.yellow(socket.id)}`);
  }
)

export default [register, unregister]