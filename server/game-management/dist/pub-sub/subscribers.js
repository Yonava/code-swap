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
    acc[curr.id] = curr?.startingCode ?? '';
    return acc;
}, {});
const injectCurrentSubmissionState = (challenge) => {
    console.log('injecting in progress');
    const matchSubmissions = codeSubmissions_1.codeSubmissions.get(challenge.matchId);
    if (!matchSubmissions) {
        console.log('no submissions on match that should exist');
        return;
    }
    const playerIdToChallengeId = Object.entries(challenge.challenges).reduce((acc, [playerId, { challengeId }]) => {
        acc[playerId] = challengeId;
        return acc;
    }, {});
    const playerIds = Object.keys(challenge.challenges);
    for (const playerId of playerIds) {
        const team = playerToTeam_1.playerToTeam.get(playerId);
        if (team === undefined) {
            console.log('player should be assigned to a team but was not :(');
            return;
        }
        const challengeId = playerIdToChallengeId[playerId];
        const currentSubmission = matchSubmissions[team][challengeId];
        challenge.challenges[playerId].code = currentSubmission;
    }
};
(0, listenToChannel_1.listenToChannel)({
    from: START_MATCH,
    fn: async ({ match }) => {
        const challenges = await (0, createChallengeRounds_1.fetchChallenges)(createChallengeRounds_1.NUMBER_OF_ROUNDS * 2);
        const challengesByRound = (0, createChallengeRounds_1.packChallengesByRound)(challenges);
        const [starts, ends] = (0, createChallengeRounds_1.createChallengeRounds)(match, challengesByRound);
        (0, listenToChannel_1.logResponse)({ channel: START_MATCH, payload: JSON.stringify(starts) });
        codeSubmissions_1.codeSubmissions.set(match.id, [
            getNewChallengeSetSubmissionObj(challenges),
            getNewChallengeSetSubmissionObj(challenges),
        ]);
        playerToTeam_1.playerToTeam.set(match.teams[0][0].id, 0);
        playerToTeam_1.playerToTeam.set(match.teams[0][1].id, 0);
        playerToTeam_1.playerToTeam.set(match.teams[1][0].id, 1);
        playerToTeam_1.playerToTeam.set(match.teams[1][1].id, 1);
        for (let i = 0; i < starts.length; i++) {
            setTimeout(() => {
                injectCurrentSubmissionState(starts[i]);
                pub.publish(START_CHALLENGE, JSON.stringify(starts[i]));
            }, i * createChallengeRounds_1.TIME_FROM_START_TO_START);
        }
        for (let i = 0; i < ends.length; i++) {
            setTimeout(() => {
                pub.publish(END_CHALLENGE, JSON.stringify(ends[i]));
            }, (i * createChallengeRounds_1.TIME_FROM_START_TO_START) + createChallengeRounds_1.TIME_FROM_START_TO_END);
        }
    }
});
(0, listenToChannel_1.listenToChannel)({
    from: UPDATE_CODE_SUBMISSION,
    fn: async ({ playerId, matchId, challengeId, code }) => {
        const match = codeSubmissions_1.codeSubmissions.get(matchId);
        if (!match) {
            console.log('match not found');
            return;
        }
        const team = playerToTeam_1.playerToTeam.get(playerId);
        if (team === undefined) {
            console.log('team not found');
            return;
        }
        match[team][challengeId] = code;
    }
});
