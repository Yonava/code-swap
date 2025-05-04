import { MatchResult, SCORING_CHANNEL } from "shared-types";
import { listenToChannel } from "../listenToChannel";
import { io } from "../socket";

const { MATCH_RESULT } = SCORING_CHANNEL

listenToChannel<MatchResult>({
  from: MATCH_RESULT,
  fn: (data) => io.to(data.matchId).emit(MATCH_RESULT, data)
})