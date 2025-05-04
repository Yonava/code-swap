"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listenToChannel_1 = require("../listenToChannel");
const shared_types_1 = require("shared-types");
const redis_1 = require("../redis");
const createChallengeRounds_1 = require("../createChallengeRounds");
const codeSubmissions_1 = require("../db/codeSubmissions");
const playerToTeam_1 = require("../db/playerToTeam");
const { pub } = redis_1.RedisClient.getInstance();
const { START_MATCH, START_CHALLENGE, END_CHALLENGE, UPDATE_CODE_SUBMISSION } = shared_types_1.GAME_MANAGEMENT_CHANNEL;
const getNewChallengeSetSubmissionObj = (challenges) => challenges.reduce((acc, curr) => {
    const { id: challengeId } = curr;
    acc[challengeId] = {
        challengeId,
        code: curr?.startingCode ?? "",
        isFinished: false,
    };
    return acc;
}, {});
(0, listenToChannel_1.listenToChannel)({
    from: START_MATCH,
    fn: async ({ match }) => {
        const challenges = await (0, createChallengeRounds_1.fetchChallenges)(2);
        codeSubmissions_1.codeSubmissions.set(match.id, [
            getNewChallengeSetSubmissionObj(challenges),
            getNewChallengeSetSubmissionObj(challenges),
        ]);
        const [team1, team2] = match.teams;
        const [team1Player1, team1Player2] = team1;
        const [team2Player1, team2Player2] = team2;
        playerToTeam_1.playerToTeam.set(team1Player1.id, 0);
        playerToTeam_1.playerToTeam.set(team1Player2.id, 0);
        playerToTeam_1.playerToTeam.set(team2Player1.id, 1);
        playerToTeam_1.playerToTeam.set(team2Player2.id, 1);
        let numOfCalls = 0;
        const processRound = () => {
            numOfCalls++;
            const isRoundStarting = numOfCalls % 2 === 1;
            if (isRoundStarting) {
                const submissions = codeSubmissions_1.codeSubmissions.get(match.id);
                if (!submissions)
                    throw new Error('No Submissions Found: Invalid State!');
                const [team1Submissions, team2Submissions] = submissions;
                const offset = numOfCalls % 4 === 1;
                const start = {
                    endsAt: Date.now() + createChallengeRounds_1.TIME_FROM_START_TO_END,
                    matchId: match.id,
                    challenges: {
                        [team1Player1.id]: team1Submissions[offset ? 0 : 1],
                        [team1Player2.id]: team1Submissions[offset ? 1 : 0],
                        [team2Player1.id]: team2Submissions[offset ? 0 : 1],
                        [team2Player2.id]: team2Submissions[offset ? 1 : 0]
                    }
                };
                const startPayload = JSON.stringify(start);
                pub.publish(START_CHALLENGE, startPayload);
                setTimeout(processRound, createChallengeRounds_1.TIME_FROM_START_TO_END);
            }
            else {
                const end = {
                    startsAt: Date.now() + createChallengeRounds_1.TIME_FROM_END_TO_START,
                    matchId: match.id
                };
                const endPayload = JSON.stringify(end);
                pub.publish(END_CHALLENGE, endPayload);
                setTimeout(processRound, createChallengeRounds_1.TIME_FROM_END_TO_START);
            }
        };
        processRound();
    },
});
(0, listenToChannel_1.listenToChannel)({
    from: UPDATE_CODE_SUBMISSION,
    fn: async ({ playerId, matchId, challengeId, code }) => {
        const match = codeSubmissions_1.codeSubmissions.get(matchId);
        if (!match) {
            console.log("match not found");
            return;
        }
        const team = playerToTeam_1.playerToTeam.get(playerId);
        if (team === undefined) {
            console.log("team not found");
            return;
        }
        match[team][challengeId].code = code;
    },
});
