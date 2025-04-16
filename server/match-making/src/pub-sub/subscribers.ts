import {
  type CreateMatchRequest,
  CreateMatchResponse,
  type JoinMatchRequest,
  JoinMatchResponse,
  type LeaveMatch,
  MATCH_MAKING_CHANNEL
} from 'shared-types/dist/match-making';
import {
  addPlayerToMatch,
  createNewMatch,
  removePlayerFromMatch
} from "../matches";
import { listenToChannel } from '../listenToChannel';

const {
  REQUEST_CREATE_MATCH,
  RESPONSE_CREATE_MATCH,
  REQUEST_JOIN_MATCH,
  RESPONSE_JOIN_MATCH,
  LEAVE_MATCH
} = MATCH_MAKING_CHANNEL;

listenToChannel<CreateMatchRequest, CreateMatchResponse>({
  from: REQUEST_CREATE_MATCH,
  replyTo: RESPONSE_CREATE_MATCH,
  fn: async ({ player }) => {
    const res = await createNewMatch(player);
    if (typeof res === 'string') return { error: res, playerId: player.id };
    return { match: res, playerId: player.id };
  }
});

listenToChannel<JoinMatchRequest, JoinMatchResponse>({
  from: REQUEST_JOIN_MATCH,
  replyTo: RESPONSE_JOIN_MATCH,
  fn: async ({ matchId, player, teamIndex }) => {
    const res = await addPlayerToMatch({ matchId, player, teamIndex });
    if (typeof res === 'string') return { error: res, playerId: player.id };
    return { match: res, playerId: player.id };
  }
});

listenToChannel<LeaveMatch>({
  from: LEAVE_MATCH,
  fn: ({ matchId, playerId }) => removePlayerFromMatch(matchId, playerId)
});