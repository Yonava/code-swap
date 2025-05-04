"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_MANAGEMENT_CHANNEL = exports.GAME_MANAGEMENT_CHANNEL_PREFIX = void 0;
exports.GAME_MANAGEMENT_CHANNEL_PREFIX = "gameManagement";
exports.GAME_MANAGEMENT_CHANNEL = {
    START_MATCH: "".concat(exports.GAME_MANAGEMENT_CHANNEL_PREFIX, ".startMatch"),
    START_CHALLENGE: "".concat(exports.GAME_MANAGEMENT_CHANNEL_PREFIX, ".startChallenge"),
    END_CHALLENGE: "".concat(exports.GAME_MANAGEMENT_CHANNEL_PREFIX, ".endChallenge"),
    MATCH_ENDING: "".concat(exports.GAME_MANAGEMENT_CHANNEL_PREFIX, ".matchEnding"),
    UPDATE_CODE_SUBMISSION: "".concat(exports.GAME_MANAGEMENT_CHANNEL_PREFIX, ".updateCodeSubmission"),
};
