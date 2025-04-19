"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPlayerIdMatchIdPairings = exports.deletePlayerMatchId = exports.setPlayerMatchId = exports.getPlayerMatchId = exports.getAllMatches = exports.deleteMatch = exports.setMatch = exports.getMatch = exports.getNewMatchId = exports.matchDbLogger = void 0;
const MATCH_DB_PREFIX = '[Match DB]';
const matchDbLogger = (...msg) => console.log(MATCH_DB_PREFIX, ...msg);
exports.matchDbLogger = matchDbLogger;
// mimics the behavior of a database
const matches = new Map();
const playerIdToMatchId = new Map();
const getNewMatchId = () => {
    const id = Math.random().toString(36).substring(2, 7);
    return matches.has(id) ? (0, exports.getNewMatchId)() : id;
};
exports.getNewMatchId = getNewMatchId;
const getMatch = async (matchId) => matches.get(matchId);
exports.getMatch = getMatch;
const setMatch = async (match) => (matches.set(match.id, match), match);
exports.setMatch = setMatch;
const deleteMatch = async (matchId) => matches.delete(matchId);
exports.deleteMatch = deleteMatch;
const getAllMatches = async () => Array.from(matches.values());
exports.getAllMatches = getAllMatches;
const getPlayerMatchId = async (playerId) => playerIdToMatchId.get(playerId);
exports.getPlayerMatchId = getPlayerMatchId;
const setPlayerMatchId = async (playerId, matchId) => {
    playerIdToMatchId.set(playerId, matchId);
    return matchId;
};
exports.setPlayerMatchId = setPlayerMatchId;
const deletePlayerMatchId = async (playerId) => playerIdToMatchId.delete(playerId);
exports.deletePlayerMatchId = deletePlayerMatchId;
const getAllPlayerIdMatchIdPairings = async () => Array.from(playerIdToMatchId.entries());
exports.getAllPlayerIdMatchIdPairings = getAllPlayerIdMatchIdPairings;
