"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePlayerFromMatch = exports.addPlayerToMatch = exports.createNewMatch = exports.deletePlayerMatchId = exports.setPlayerMatchId = exports.getPlayerMatchId = exports.getAllMatches = exports.deleteMatch = exports.setMatch = exports.getMatch = exports.getNewMatchId = void 0;
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
const createNewMatch = async (host) => (0, exports.setMatch)({
    id: (0, exports.getNewMatchId)(),
    teams: [[host, undefined], [undefined, undefined]],
    hostId: host.id,
});
exports.createNewMatch = createNewMatch;
const addPlayerToMatch = async ({ matchId, player, teamIndex }) => {
    const existingMatchId = await (0, exports.getPlayerMatchId)(player.id);
    if (existingMatchId)
        return 'Player already in match';
    const match = await (0, exports.getMatch)(matchId);
    if (!match)
        return 'Match not found';
    const index = match.teams[teamIndex].findIndex((slot) => slot === undefined);
    if (index === -1)
        return 'Match is full';
    match.teams[teamIndex][index] = player;
    return (0, exports.setMatch)(match);
};
exports.addPlayerToMatch = addPlayerToMatch;
const removePlayerFromMatch = async (matchId, playerId) => {
};
exports.removePlayerFromMatch = removePlayerFromMatch;
