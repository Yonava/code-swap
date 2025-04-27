"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const match_making_1 = require("shared-types/dist/match-making");
const createInboundRequest_1 = require("../createInboundRequest");
const { REQUEST_CREATE_MATCH, REQUEST_JOIN_MATCH, LEAVE_MATCH } = match_making_1.MATCH_MAKING_CHANNEL;
const requestCreateMatch = (0, createInboundRequest_1.createInboundRequest)(REQUEST_CREATE_MATCH);
const requestJoinMatch = (0, createInboundRequest_1.createInboundRequest)(REQUEST_JOIN_MATCH);
const leaveMatch = (0, createInboundRequest_1.createInboundRequest)(LEAVE_MATCH);
exports.default = [requestCreateMatch, requestJoinMatch, leaveMatch];
