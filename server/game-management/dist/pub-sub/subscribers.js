"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const listenToChannel_1 = require("../listenToChannel");
const shared_types_1 = require("shared-types");
const axios_1 = __importDefault(require("axios"));
const { START_MATCH, START_CHALLENGE } = shared_types_1.GAME_MANAGEMENT_CHANNEL;
const fetchChallenges = async () => {
    const CHALLENGE_URL = `http://localhost:3003/challenges/random?count=2`;
    const { data } = await axios_1.default.get(CHALLENGE_URL);
    if ('error' in data)
        throw new Error(data.error);
    return data;
};
(0, listenToChannel_1.listenToChannel)({
    from: START_MATCH,
    replyTo: START_CHALLENGE,
    fn: async ({ match }) => {
        const challenges = await fetchChallenges();
        const [team1, team2] = match.teams;
        const [t1p1, t1p2] = team1;
        const [t2p1, t2p2] = team2;
        return {
            matchId: match.id,
            round: 1,
            endsAt: 204,
            challenges: {
                [t1p1.id]: {
                    challengeId: challenges[0].id,
                    code: challenges[0].startingCode ?? ''
                },
                [t1p2.id]: {
                    challengeId: challenges[1].id,
                    code: challenges[0].startingCode ?? ''
                },
            }
        };
    }
});
