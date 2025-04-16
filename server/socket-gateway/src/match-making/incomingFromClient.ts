import { MATCH_MAKING_CHANNEL } from "shared-types/dist/match-making";
import { createInboundRequest } from "../createInboundRequest";

const {
  REQUEST_CREATE_MATCH,
  REQUEST_JOIN_MATCH,
  LEAVE_MATCH
} = MATCH_MAKING_CHANNEL;

const requestCreateMatch = createInboundRequest(REQUEST_CREATE_MATCH);
const requestJoinMatch = createInboundRequest(REQUEST_JOIN_MATCH);
const leaveMatch = createInboundRequest(LEAVE_MATCH);

export default [requestCreateMatch, requestJoinMatch, leaveMatch]