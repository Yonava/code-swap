import { StartChallenge, GAME_MANAGEMENT_CHANNEL } from "shared-types";
import { listenToChannel } from "../listenToChannel";
import { io } from "../socket";

const { START_CHALLENGE } = GAME_MANAGEMENT_CHANNEL

listenToChannel<StartChallenge>({
  from: START_CHALLENGE,
  fn: (data) => io.to(data.matchId).emit(START_CHALLENGE, data)
})