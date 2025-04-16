"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const match_making_1 = require("shared-types/dist/match-making");
const matches_1 = require("../matches");
const listener_1 = require("../listener");
const { REQUEST_CREATE_MATCH, RESPONSE_CREATE_MATCH, REQUEST_JOIN_MATCH, RESPONSE_JOIN_MATCH, LEAVE_MATCH } = match_making_1.MATCH_MAKING_CHANNEL;
(0, listener_1.listenToInboundRequests)({
    from: REQUEST_CREATE_MATCH,
    replyTo: RESPONSE_CREATE_MATCH,
    fn: async ({ player }) => {
        const res = await (0, matches_1.createNewMatch)(player);
        if (typeof res === 'string')
            return { error: res };
        return { match: res };
    }
});
(0, listener_1.listenToInboundRequests)({
    from: REQUEST_JOIN_MATCH,
    replyTo: RESPONSE_JOIN_MATCH,
    fn: async ({ matchId, player, teamIndex }) => {
        const res = await (0, matches_1.addPlayerToMatch)({ matchId, player, teamIndex });
        if (typeof res === 'string')
            return { error: res };
        return { match: res };
    }
});
(0, listener_1.listenToInboundRequests)({
    from: LEAVE_MATCH,
    fn: ({ matchId, playerId }) => (0, matches_1.removePlayerFromMatch)(matchId, playerId)
});
