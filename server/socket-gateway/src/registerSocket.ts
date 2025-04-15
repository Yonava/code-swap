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
    const mappings = await getAllMappings();
    socketLogger(SOCKET_GATEWAY_REGISTRATION_EVENT_NAME, mappings);
    socketLogger(`Unregistered ${chalk.bold.green(playerId)} from ${chalk.bold.yellow(socket.id)}`);
  }
)

export default [register, unregister]