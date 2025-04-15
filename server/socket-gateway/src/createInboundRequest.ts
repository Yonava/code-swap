import type { ClientSocketEvents, PlayerSocketInstance } from "shared-types/dist/socket-gateway";
import { socketLogger } from "./socket";
import { RedisClient } from "./redis";
import { getPlayerIdFromSocketId } from "./registrationDatabase";
import chalk from "chalk";

const { pub } = RedisClient.getInstance();

const prettyPrint = ({ channel, socketId, playerId, payload }: {
  channel: keyof ClientSocketEvents,
  socketId: string,
  playerId: string,
  payload: unknown
}) => {
  socketLogger(`----------------------
    Inbound Request to ${channel} from Socket ID: ${socketId}\n
    Payload: ${JSON.stringify(payload, null, 2)}\n
    Registered to Player ID: ${playerId}\n
    ----------------------`)
}

export const createInboundRequest = (channel: keyof ClientSocketEvents) => (
  socket: PlayerSocketInstance
) => socket.on(
  channel,
  async (req: unknown) => {
    const playerId = await getPlayerIdFromSocketId(socket.id);
    if (!playerId) {
      socketLogger(`${chalk.bold.red('Error!')} On inbound request to ${chalk.bold.blue(channel)}:
 Registration Not Found For Socket ID: ${socket.id}`);
      return;
    }
    prettyPrint({
      channel,
      socketId: socket.id,
      playerId,
      payload: req
    });
    pub.publish(channel, JSON.stringify(req))
  }
)
