"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const match_making_1 = require("shared-types/dist/match-making");
const matches_1 = require("../matches");
const listenToChannel_1 = require("../listenToChannel");
const shared_types_1 = require("shared-types");
const constants_1 = require("../constants");
const matches_2 = require("../db/matches");
const { REQUEST_CREATE_MATCH, RESPONSE_CREATE_MATCH, REQUEST_JOIN_MATCH, RESPONSE_JOIN_MATCH, LEAVE_MATCH, PLAYER_LEFT, MATCH_READY, } = match_making_1.MATCH_MAKING_CHANNEL;
const logError = (playerId, matchId, channel, issue) => {
    const i = constants_1.LOG_COLORS.error(issue);
    const p = constants_1.LOG_COLORS.playerId(playerId);
    const m = constants_1.LOG_COLORS.matchId(matchId);
    const c = constants_1.LOG_COLORS.channel(channel);
    (0, listenToChannel_1.pubSubLogger)(`${i} when player ${p} sent a request to ${c} for match ${m}`);
};
(0, listenToChannel_1.listenToChannel)({
    from: REQUEST_CREATE_MATCH,
    replyTo: RESPONSE_CREATE_MATCH,
    fn: async ({ player }) => {
        const res = await (0, matches_1.createNewMatch)(player);
        if (typeof res === 'string') {
            logError(player.id, 'UNCREATED', REQUEST_CREATE_MATCH, res);
            return { error: res, playerId: player.id };
        }
        return { match: res, playerId: player.id };
    }
});
(0, listenToChannel_1.listenToChannel)({
    from: REQUEST_JOIN_MATCH,
    replyTo: RESPONSE_JOIN_MATCH,
    fn: async ({ matchId, player, teamIndex }) => {
        const res = await (0, matches_1.addPlayerToMatch)({ matchId, player, teamIndex });
        if (typeof res === 'string') {
            logError(player.id, matchId, REQUEST_JOIN_MATCH, res);
            return { error: res, playerId: player.id };
        }
        return { match: res, playerId: player.id };
    }
});
(0, listenToChannel_1.listenToChannel)({
    from: LEAVE_MATCH,
    replyTo: PLAYER_LEFT,
    fn: async ({ playerId }) => {
        const matchId = await (0, matches_2.getPlayerMatchId)(playerId);
        if (!matchId) {
            logError(playerId, '[not found]', LEAVE_MATCH, 'Match not found');
            return;
        }
        const res = await (0, matches_1.removePlayerFromMatch)(matchId, playerId);
        if (typeof res === 'string') {
            logError(playerId, matchId, LEAVE_MATCH, res);
            return;
        }
        return { match: res };
    }
});
(0, listenToChannel_1.listenToChannel)({
    from: MATCH_READY,
    replyTo: shared_types_1.GAME_MANAGEMENT_CHANNEL.START_MATCH,
    fn: async ({ playerId }) => {
        const matchId = await (0, matches_2.getPlayerMatchId)(playerId);
        if (!matchId) {
            logError(playerId, '[not found]', MATCH_READY, 'Match not found');
            return;
        }
        const match = await (0, matches_2.getMatch)(matchId);
        if (!match) {
            logError(playerId, matchId, MATCH_READY, 'Player has matchId that does not exist');
            return;
        }
        const isHost = match.hostId === playerId;
        if (!isHost) {
            logError(playerId, matchId, MATCH_READY, 'Player doesn\'t have host permissions');
            return;
        }
        const allPlayerSlotsFilled = match.teams.flat().every(Boolean);
        if (!allPlayerSlotsFilled) {
            logError(playerId, matchId, MATCH_READY, 'Tried to begin match without required players');
        }
        return { match: match };
    }
});
