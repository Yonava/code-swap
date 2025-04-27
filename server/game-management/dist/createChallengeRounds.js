"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChallengeRounds = exports.TIME_FROM_START_TO_START = exports.TIME_FROM_START_TO_END = exports.NUMBER_OF_SWAPS_PER_ROUND = exports.NUMBER_OF_ROUNDS = exports.packChallengesByRound = exports.fetchChallenges = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchChallenges = async (count) => {
    const CHALLENGE_URL = `http://localhost:3003/challenges/random?count=${count}`;
    const { data } = await axios_1.default.get(CHALLENGE_URL);
    if ('error' in data)
        throw new Error(data.error);
    return data;
};
exports.fetchChallenges = fetchChallenges;
const packChallengesByRound = (challenges) => {
    if (challenges.length % 2 !== 0) {
        throw new Error('number of challenges must be even');
    }
    const challengesByRound = [];
    for (let i = 0; i < challenges.length; i += 2) {
        challengesByRound.push([challenges[i], challenges[i + 1]]);
    }
    return challengesByRound;
};
exports.packChallengesByRound = packChallengesByRound;
/**
 * number of rounds per match.
 * a round is a set of two challenges that are swapped between players in a team n number of times
 */
exports.NUMBER_OF_ROUNDS = 1;
/**
 * number of times the editor will swap with a teammate per challenge/round
 * ie 1 means each player gets 1 stab at the challenge, 2 means player 1 gets 2 stabs at challenge 1
 * while player 2 gets 1 stab at challenge 1 but 2 stabs at challenge 2
 */
exports.NUMBER_OF_SWAPS_PER_ROUND = 2;
/**
 * time from start of challenge to end of challenge
 */
exports.TIME_FROM_START_TO_END = 1_000 * 30;
/**
 * time between the end of a challenge and the start of a new challenge event
 */
const TIME_FROM_END_TO_START = 1_000 * 5;
/**
 * can be used as time from end to end as well
 */
exports.TIME_FROM_START_TO_START = exports.TIME_FROM_START_TO_END + TIME_FROM_END_TO_START;
/**
 * create the messages that will be broadcast to the client
 *
 * @param match
 * @param challengesByRound a list of challenges paired together by round
 */
const createChallengeRounds = (match, challengesByRound) => {
    if (challengesByRound.length === 0) {
        throw new Error('cannot create challenge rounds with no rounds');
    }
    const challengeStarts = [];
    const challengeEnds = [];
    const [team1, team2] = match.teams;
    const [t1p1, t1p2] = team1;
    const [t2p1, t2p2] = team2;
    for (let i = 0; i < challengesByRound.length; i++) {
        const [challenge1, challenge2] = challengesByRound[i];
        let start = {
            matchId: match.id,
            round: i,
            endsAt: Date.now() + exports.TIME_FROM_START_TO_END,
            challenges: {
                [t1p1.id]: {
                    challengeId: challenge1.id,
                    code: challenge1.startingCode ?? '',
                },
                [t1p2.id]: {
                    challengeId: challenge2.id,
                    code: challenge2.startingCode ?? '',
                },
                [t2p1.id]: {
                    challengeId: challenge1.id,
                    code: challenge1.startingCode ?? '',
                },
                [t2p2.id]: {
                    challengeId: challenge2.id,
                    code: challenge2.startingCode ?? '',
                },
            }
        };
        challengeStarts.push(JSON.parse(JSON.stringify(start)));
        start.endsAt += TIME_FROM_END_TO_START;
        challengeEnds.push({ startsAt: start.endsAt, matchId: match.id });
        for (let j = 0; j < exports.NUMBER_OF_SWAPS_PER_ROUND; j++) {
            start.endsAt += exports.TIME_FROM_START_TO_END;
            start.challenges = {
                [t1p1.id]: start.challenges[t1p2.id],
                [t1p2.id]: start.challenges[t1p1.id],
                [t2p1.id]: start.challenges[t2p2.id],
                [t2p2.id]: start.challenges[t2p1.id]
            };
            challengeStarts.push(JSON.parse(JSON.stringify(start)));
            start.endsAt += TIME_FROM_END_TO_START;
            challengeEnds.push({ startsAt: start.endsAt, matchId: match.id });
        }
    }
    // no more challenges to emit - so last startsAt should be undefined
    challengeEnds.at(-1).startsAt = undefined;
    return [challengeStarts, challengeEnds];
};
exports.createChallengeRounds = createChallengeRounds;
