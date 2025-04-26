import { StartChallenge, GAME_MANAGEMENT_CHANNEL, EndChallenge } from "shared-types";
import { listenToChannel } from "../listenToChannel";
import { io } from "../socket";

const { START_CHALLENGE, END_CHALLENGE } = GAME_MANAGEMENT_CHANNEL

listenToChannel<StartChallenge>({
  from: START_CHALLENGE,
  fn: (data) => io.to(data.matchId).emit(START_CHALLENGE, data)
})

listenToChannel<EndChallenge>({
  from: END_CHALLENGE,
  fn: (data) => io.to(data.matchId).emit(END_CHALLENGE, data)
})