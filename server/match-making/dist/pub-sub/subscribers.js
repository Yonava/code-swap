"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const match_making_1 = require("shared-types/dist/match-making");
const matches_1 = require("../matches");
const listenToChannel_1 = require("../listenToChannel");
const constants_1 = require("../constants");
const matches_2 = require("../db/matches");
const { REQUEST_CREATE_MATCH, RESPONSE_CREATE_MATCH, REQUEST_JOIN_MATCH, RESPONSE_JOIN_MATCH, LEAVE_MATCH, PLAYER_LEFT, } = match_making_1.MATCH_MAKING_CHANNEL;
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
