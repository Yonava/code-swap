import {
  type CreateMatchRequest,
  type JoinMatchRequest,
  type LeaveMatch,
  MATCH_MAKING_CHANNEL
} from 'shared-types/dist/match-making';
import {
  addPlayerToMatch,
  createNewMatch,
  removePlayerFromMatch
} from "../matches";
import { listenToInboundRequests } from '../listener';

const {
  REQUEST_CREATE_MATCH,
  RESPONSE_CREATE_MATCH,
  REQUEST_JOIN_MATCH,
  RESPONSE_JOIN_MATCH,
  LEAVE_MATCH
} = MATCH_MAKING_CHANNEL;

listenToInboundRequests<CreateMatchRequest>({
  from: REQUEST_CREATE_MATCH,
  replyTo: RESPONSE_CREATE_MATCH,
  fn: async ({ player }) => {
    const res = await createNewMatch(player);
    if (typeof res === 'string') return { error: res };
    return { match: res };
  }
});

listenToInboundRequests<JoinMatchRequest>({
  from: REQUEST_JOIN_MATCH,
  replyTo: RESPONSE_JOIN_MATCH,
  fn: async ({ matchId, player, teamIndex }) => {
    const res = await addPlayerToMatch({ matchId, player, teamIndex });
    if (typeof res === 'string') return { error: res };
    return { match: res };
  }
});

listenToInboundRequests<LeaveMatch>({
  from: LEAVE_MATCH,
  fn: ({ matchId, playerId }) => removePlayerFromMatch(matchId, playerId)
});