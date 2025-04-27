"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MATCH_MAKING_CHANNEL = exports.MATCH_MAKING_CHANNEL_PREFIX = void 0;
exports.MATCH_MAKING_CHANNEL_PREFIX = 'matchMaking';
exports.MATCH_MAKING_CHANNEL = {
    SUBSCRIBE: {
        REQUEST_JOIN_MATCH: `${exports.MATCH_MAKING_CHANNEL_PREFIX}.requestJoinMatch`,
        REQUEST_CREATE_MATCH: `${exports.MATCH_MAKING_CHANNEL_PREFIX}.requestCreateMatch`,
        LEAVE_MATCH: `${exports.MATCH_MAKING_CHANNEL_PREFIX}.leaveMatch`
    },
    PUBLISH: {
        RESPONSE_JOIN_MATCH: `${exports.MATCH_MAKING_CHANNEL_PREFIX}.responseJoinMatch`,
        RESPONSE_CREATE_MATCH: `${exports.MATCH_MAKING_CHANNEL_PREFIX}.responseCreateMatch`,
    }
};
