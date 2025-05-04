import { StartChallenge, GAME_MANAGEMENT_CHANNEL, EndChallenge, MatchEnding, MatchIdForRouting, SCORING_CHANNEL } from "shared-types";
import { listenToChannel } from "../listenToChannel";
import { io } from "../socket";

const { START_CHALLENGE, END_CHALLENGE, MATCH_ENDING, MATCH_ENDED } = GAME_MANAGEMENT_CHANNEL

listenToChannel<StartChallenge>({
  from: START_CHALLENGE,
  fn: (data) => io.to(data.matchId).emit(START_CHALLENGE, data)
})

listenToChannel<EndChallenge>({
  from: END_CHALLENGE,
  fn: (data) => io.to(data.matchId).emit(END_CHALLENGE, data)
})

listenToChannel<MatchEnding>({
  from: MATCH_ENDING,
  fn: (data) => io.to(data.matchId).emit(MATCH_ENDING, data)
})

listenToChannel<MatchIdForRouting>({
  from: MATCH_ENDED,
  fn: (data) => io.to(data.matchId).emit(MATCH_ENDED)
})