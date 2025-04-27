"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MATCH_MAKING_CHANNEL = exports.MATCH_MAKING_CHANNEL_PREFIX = void 0;
exports.MATCH_MAKING_CHANNEL_PREFIX = 'matchMaking';
exports.MATCH_MAKING_CHANNEL = {
    REQUEST_JOIN_MATCH: "".concat(exports.MATCH_MAKING_CHANNEL_PREFIX, ".requestJoinMatch"),
    REQUEST_CREATE_MATCH: "".concat(exports.MATCH_MAKING_CHANNEL_PREFIX, ".requestCreateMatch"),
    LEAVE_MATCH: "".concat(exports.MATCH_MAKING_CHANNEL_PREFIX, ".leaveMatch"),
    RESPONSE_JOIN_MATCH: "".concat(exports.MATCH_MAKING_CHANNEL_PREFIX, ".responseJoinMatch"),
    RESPONSE_CREATE_MATCH: "".concat(exports.MATCH_MAKING_CHANNEL_PREFIX, ".responseCreateMatch"),
    PLAYER_JOINED: "".concat(exports.MATCH_MAKING_CHANNEL_PREFIX, ".playerJoined"),
    PLAYER_LEFT: "".concat(exports.MATCH_MAKING_CHANNEL_PREFIX, ".playerLeft"),
    MATCH_READY: "".concat(exports.MATCH_MAKING_CHANNEL_PREFIX, ".matchReady"),
};
