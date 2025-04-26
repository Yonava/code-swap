import { GAME_MANAGEMENT_CHANNEL, PlayerSocketInstance } from "shared-types"
import { getPlayerIdFromSocketId } from "../registrationDatabase";
import { printReceivedSuccess, printRegistrationNotFoundError } from "../printInboundRequest";
import { RedisClient } from "../redis";

const { pub } = RedisClient.getInstance()
const { UPDATE_CODE_SUBMISSION } = GAME_MANAGEMENT_CHANNEL

const updateCodeSubmission = (socket: PlayerSocketInstance) => {
  socket.on(UPDATE_CODE_SUBMISSION, async (data) => {
    const { id: socketId } = socket
    const playerId = await getPlayerIdFromSocketId(socketId);
    if (!playerId) return printRegistrationNotFoundError({ channel: UPDATE_CODE_SUBMISSION, socketId })

    printReceivedSuccess({ channel: UPDATE_CODE_SUBMISSION, playerId, payload: data })
    pub.publish(UPDATE_CODE_SUBMISSION, JSON.stringify({ playerId, ...data }))
  })
}

export default [updateCodeSubmission]