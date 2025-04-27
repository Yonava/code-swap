import { GAME_MANAGEMENT_CHANNEL, PlayerSocketInstance } from "shared-types"
import { printReceivedSuccess } from "../printInboundRequest";
import { RedisClient } from "../redis";

const { pub } = RedisClient.getInstance()
const { UPDATE_CODE_SUBMISSION } = GAME_MANAGEMENT_CHANNEL

const updateCodeSubmission = (socket: PlayerSocketInstance) => {
  socket.on(UPDATE_CODE_SUBMISSION, async (data) => {
    printReceivedSuccess({ channel: UPDATE_CODE_SUBMISSION, playerId: data.playerId, payload: data })
    pub.publish(UPDATE_CODE_SUBMISSION, JSON.stringify(data))
  })
}

export default [updateCodeSubmission]