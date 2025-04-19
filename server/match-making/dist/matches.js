"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePlayerFromMatch = exports.addPlayerToMatch = exports.createNewMatch = void 0;
const matches_1 = require("./db/matches");
const constants_1 = require("./constants");
const createNewMatch = async (host) => {
    const existingMatchId = await (0, matches_1.getPlayerMatchId)(host.id);
    if (existingMatchId)
        return `Player already in match ${existingMatchId}`;
    const id = (0, matches_1.getNewMatchId)();
    await (0, matches_1.setPlayerMatchId)(host.id, id);
    return (0, matches_1.setMatch)({
        id,
        teams: [[host, undefined], [undefined, undefined]],
        hostId: host.id,
    });
};
exports.createNewMatch = createNewMatch;
const addPlayerToMatch = async ({ matchId, player, teamIndex }) => {
    const existingMatchId = await (0, matches_1.getPlayerMatchId)(player.id);
    if (existingMatchId)
        return `Player already in match ${existingMatchId}`;
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
const logHostSwitch = (matchId, oldHostId, newHostId) => {
    const oh = constants_1.LOG_COLORS.playerId(oldHostId);
    const nh = constants_1.LOG_COLORS.playerId(newHostId);
    const m = constants_1.LOG_COLORS.matchId(matchId);
    (0, matches_1.matchDbLogger)(`Host ${oh} left match ${m}. Promoting ${nh} to host`);
};
const logEmptyMatchCleanup = (matchId, lastPlayer) => {
    const lp = constants_1.LOG_COLORS.playerId(lastPlayer);
    const m = constants_1.LOG_COLORS.matchId(matchId);
    (0, matches_1.matchDbLogger)(`Deleting ${m} as the last player, ${lp}, left`);
};
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
    const isMatchEmpty = match.teams.flat().every((p) => !p);
    if (isMatchEmpty) {
        logEmptyMatchCleanup(matchId, playerId);
        await (0, matches_1.deleteMatch)(matchId);
        return 'Match removed due to being empty';
    }
    if (match.hostId === playerId) {
        const newHost = match.teams.flat().find(Boolean);
        match.hostId = newHost.id;
        logHostSwitch(matchId, playerId, newHost.id);
    }
    return (0, matches_1.setMatch)(match);
};
exports.removePlayerFromMatch = removePlayerFromMatch;
