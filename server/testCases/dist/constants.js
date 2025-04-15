"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_BASE_URL = exports.CHALLENGE_LOCALHOST_PORT = exports.LOCALHOST_PORT = void 0;
exports.LOCALHOST_PORT = 3002;
exports.CHALLENGE_LOCALHOST_PORT = 3001;
exports.API_BASE_URL = process.env.NODE_ENV === "production"
    ? process.env.API_URL || "example.com" // need actual url
    : `http://localhost:${exports.CHALLENGE_LOCALHOST_PORT}`;
