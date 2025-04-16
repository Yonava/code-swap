"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePlayerFromMatch = exports.addPlayerToMatch = exports.createNewMatch = void 0;
const matches_1 = require("./db/matches");
const createNewMatch = async (host) => {
    const existingMatchId = await (0, matches_1.getPlayerMatchId)(host.id);
    if (existingMatchId)
        return 'Player already in match';
    return (0, matches_1.setMatch)({
        id: (0, matches_1.getNewMatchId)(),
        teams: [[host, undefined], [undefined, undefined]],
        hostId: host.id,
    });
};
exports.createNewMatch = createNewMatch;
const addPlayerToMatch = async ({ matchId, player, teamIndex }) => {
    const existingMatchId = await (0, matches_1.getPlayerMatchId)(player.id);
    if (existingMatchId)
        return 'Player already in match';
    const match = await (0, matches_1.getMatch)(matchId);
    if (!match)
        return 'Match not found';
    const index = match.teams[teamIndex].findIndex((slot) => slot === undefined);
    if (index === -1)
        return 'Team is full';
    match.teams[teamIndex][index] = player;
    await (0, matches_1.setPlayerMatchId)(player.id, matchId);
    return (0, matches_1.setMatch)(match);
};
exports.addPlayerToMatch = addPlayerToMatch;
const removePlayerFromMatch = async (matchId, playerId) => {
    const match = await (0, matches_1.getMatch)(matchId);
    if (!match)
        return 'Match not found';
    const teamIndex = match.teams.findIndex((team) => team.find((player) => player?.id === playerId));
    if (teamIndex === -1)
        return 'Player not in match';
    const index = match.teams[teamIndex].findIndex((player) => player?.id === playerId);
    if (index === -1)
        return 'Player not in match';
    match.teams[teamIndex][index] = undefined;
    await (0, matches_1.deletePlayerMatchId)(playerId);
    return (0, matches_1.setMatch)(match);
};
exports.removePlayerFromMatch = removePlayerFromMatch;
