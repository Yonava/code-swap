import { listenToChannel } from "../listenToChannel";
import { MatchReadyToScore, SCORING_CHANNEL } from "shared-types";

listenToChannel<MatchReadyToScore>({
  from: SCORING_CHANNEL.MATCH_READY_TO_SCORE,
  fn: async (data) => {
    console.log("scoring", data.challengeSet);
  },
});
