"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIME_BEFORE_MATCH_ENDS = exports.TIME_FROM_END_TO_START = exports.TIME_FROM_START_TO_END = exports.fetchChallenges = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchChallenges = async (count) => {
    const CHALLENGE_URL = `http://localhost:3003/challenges/random?count=${count}`;
    const { data } = await axios_1.default.get(CHALLENGE_URL);
    if ('error' in data)
        throw new Error(data.error);
    return data;
};
exports.fetchChallenges = fetchChallenges;
/**
 * time from start of round to end of round
 */
exports.TIME_FROM_START_TO_END = 1_000 * 30;
/**
 * time between the end of a round and the start of a new round event
 */
exports.TIME_FROM_END_TO_START = 1_000 * 5;
/**
 * the time given to the team that has not yet submitted their
 * final code before scoring commences
 */
exports.TIME_BEFORE_MATCH_ENDS = 1_000 * 15;
