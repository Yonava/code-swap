import { listenToChannel, logResponse } from "../listenToChannel";
import {
  Challenge,
  ChallengeSetSubmissions,
  EndChallenge,
  GAME_MANAGEMENT_CHANNEL,
  StartChallenge,
  StartMatch,
  UpdateCodeSubmission,
} from "shared-types";
import { RedisClient } from "../redis";
import {
  fetchChallenges,
  TIME_FROM_END_TO_START,
  TIME_FROM_START_TO_END,
} from "../createChallengeRounds";
import { codeSubmissions } from "../db/codeSubmissions";
import { playerToTeam } from "../db/playerToTeam";
import { SCORING_CHANNEL } from "shared-types/dist/scoring";

const { pub } = RedisClient.getInstance();
const { START_MATCH, START_CHALLENGE, END_CHALLENGE, UPDATE_CODE_SUBMISSION } =
  GAME_MANAGEMENT_CHANNEL;

const getNewChallengeSetSubmissionObj = (challenges: Challenge[]) =>
  challenges.reduce<ChallengeSetSubmissions>((acc, curr) => {
    const { id: challengeId } = curr
    acc[challengeId] = {
      challengeId,
      code: curr?.startingCode ?? "",
      isFinished: false,
    }
    return acc;
  }, {});

listenToChannel<StartMatch>({
  from: START_MATCH,
  fn: async ({ match }) => {
    const challenges = await fetchChallenges(2);

    codeSubmissions.set(match.id, [
      getNewChallengeSetSubmissionObj(challenges),
      getNewChallengeSetSubmissionObj(challenges),
    ]);

    const [team1, team2] = match.teams;
    const [team1Player1, team1Player2] = team1
    const [team2Player1, team2Player2] = team2

    playerToTeam.set(team1Player1.id, 0);
    playerToTeam.set(team1Player2.id, 0);

    playerToTeam.set(team2Player1.id, 1);
    playerToTeam.set(team2Player2.id, 1);

    let numOfCalls = 0

    const processRound = () => {
      numOfCalls++
      const isRoundStarting = numOfCalls % 2 === 1
      if (isRoundStarting) {
        const submissions = codeSubmissions.get(match.id)
        if (!submissions) throw new Error('No Submissions Found: Invalid State!')
        const [team1Submissions, team2Submissions] = submissions
        const offset = numOfCalls % 4 === 1
        const start: StartChallenge = {
          endsAt: Date.now() + TIME_FROM_START_TO_END,
          matchId: match.id,
          challenges: {
            [team1Player1.id]: team1Submissions[offset ? 0 : 1],
            [team1Player2.id]: team1Submissions[offset ? 1 : 0],
            [team2Player1.id]: team2Submissions[offset ? 0 : 1],
            [team2Player2.id]: team2Submissions[offset ? 1 : 0]
          }
        }
        const startPayload = JSON.stringify(start)
        pub.publish(START_CHALLENGE, startPayload)
        setTimeout(processRound, TIME_FROM_START_TO_END)
      } else {
        const end: EndChallenge = {
          startsAt: Date.now() + TIME_FROM_END_TO_START,
          matchId: match.id
        }
        const endPayload = JSON.stringify(end)
        pub.publish(END_CHALLENGE, endPayload)
        setTimeout(processRound, TIME_FROM_END_TO_START)
      }
    }

    processRound()
  },
});

listenToChannel<UpdateCodeSubmission>({
  from: UPDATE_CODE_SUBMISSION,
  fn: async ({ playerId, matchId, challengeId, code }) => {
    const match = codeSubmissions.get(matchId);
    if (!match) {
      console.log("match not found");
      return;
    }

    const team = playerToTeam.get(playerId);
    if (team === undefined) {
      console.log("team not found");
      return;
    }

    match[team][challengeId].code = code;
  },
});
