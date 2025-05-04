"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listenToChannel_1 = require("../listenToChannel");
const shared_types_1 = require("shared-types");
const utils_1 = require("../utils");
const getChallengeResult = async (challengeId, challengeData) => {
    const res = await (0, utils_1.fetchChallenge)(challengeId);
    if (!res.challenge)
        throw 'oh no';
    const { code: team1Code } = challengeData[0];
    const { code: team2Code } = challengeData[1];
    const team1Result = await (0, utils_1.runTestCases)(team1Code, res.challenge.testCases);
    const team2Result = await (0, utils_1.runTestCases)(team2Code, res.challenge.testCases);
    return {
        challengeId,
        challengeTitle: res.challenge.title,
        gradedCodeSubmission: [team1Code, team2Code],
        testCasesPassed: [team1Result.passed, team2Result.passed],
        totalTestCases: res.challenge.testCases.length
    };
};
(0, listenToChannel_1.listenToChannel)({
    from: shared_types_1.SCORING_CHANNEL.MATCH_READY_TO_SCORE,
    replyTo: shared_types_1.SCORING_CHANNEL.MATCH_RESULT,
    fn: async ({ matchId, challengeSet }) => {
        const [challengeId1, challengeId2] = Object.keys(challengeSet[0]);
        const result = [
            await getChallengeResult(challengeId1, [challengeSet[0][challengeId1], challengeSet[1][challengeId1]]),
            await getChallengeResult(challengeId2, [challengeSet[0][challengeId2], challengeSet[1][challengeId2]])
        ];
        return {
            matchId,
            result,
        };
    },
});
