"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MATCH_MAKING_CHANNEL = exports.MATCH_MAKING_CHANNEL_PREFIX = void 0;
exports.MATCH_MAKING_CHANNEL_PREFIX = 'matchMaking';
exports.MATCH_MAKING_CHANNEL = {
    SUBSCRIBE: {
        REQUEST_JOIN_MATCH: `${exports.MATCH_MAKING_CHANNEL_PREFIX}.requestJoin`,
        LEAVE_MATCH: `${exports.MATCH_MAKING_CHANNEL_PREFIX}.leave`
    },
    PUBLISH: {
        RESPONSE_JOIN_MATCH: `${exports.MATCH_MAKING_CHANNEL_PREFIX}.responseJoin`
    }
};
