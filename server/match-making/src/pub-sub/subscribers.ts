import {
  type CreateMatchRequest,
  type CreateMatchResponse,
  type JoinMatchRequest,
  type JoinMatchResponse,
  type LeaveMatch,
  type Match,
  type Player,
  MATCH_MAKING_CHANNEL,
  MatchReady,
} from 'shared-types/dist/match-making';
import {
  addPlayerToMatch,
  createNewMatch,
  removePlayerFromMatch
} from "../matches";
import { listenToChannel, pubSubLogger } from '../listenToChannel';
import {
  GAME_MANAGEMENT_CHANNELS,
  type PlayerJoinLeave,
  type StartMatch
} from 'shared-types';
import { LOG_COLORS } from '../constants';
import { getMatch, getPlayerMatchId } from '../db/matches';

const {
  REQUEST_CREATE_MATCH,
  RESPONSE_CREATE_MATCH,
  REQUEST_JOIN_MATCH,
  RESPONSE_JOIN_MATCH,
  LEAVE_MATCH,
  PLAYER_LEFT,
  MATCH_READY,
} = MATCH_MAKING_CHANNEL;

const logError = (
  playerId: Player['id'],
  matchId: Match['id'],
  channel: string,
  issue: string
) => {
  const i = LOG_COLORS.error(issue)
  const p = LOG_COLORS.playerId(playerId)
  const m = LOG_COLORS.matchId(matchId)
  const c = LOG_COLORS.channel(channel)
  pubSubLogger(`${i} when player ${p} sent a request to ${c} for match ${m}`)
}

listenToChannel<CreateMatchRequest, CreateMatchResponse>({
  from: REQUEST_CREATE_MATCH,
  replyTo: RESPONSE_CREATE_MATCH,
  fn: async ({ player }) => {
    const res = await createNewMatch(player);
    if (typeof res === 'string') {
      logError(player.id, 'UNCREATED', REQUEST_CREATE_MATCH, res)
      return { error: res, playerId: player.id };
    }
    return { match: res, playerId: player.id };
  }
});

listenToChannel<JoinMatchRequest, JoinMatchResponse>({
  from: REQUEST_JOIN_MATCH,
  replyTo: RESPONSE_JOIN_MATCH,
  fn: async ({ matchId, player, teamIndex }) => {
    const res = await addPlayerToMatch({ matchId, player, teamIndex });
    if (typeof res === 'string') {
      logError(player.id, matchId, REQUEST_JOIN_MATCH, res)
      return { error: res, playerId: player.id };
    }
    return { match: res, playerId: player.id };
  }
});

listenToChannel<LeaveMatch, PlayerJoinLeave>({
  from: LEAVE_MATCH,
  replyTo: PLAYER_LEFT,
  fn: async ({ playerId }) => {
    const matchId = await getPlayerMatchId(playerId)
    if (!matchId) {
      logError(playerId, '[not found]', LEAVE_MATCH, 'Match not found')
      return
    }
    const res = await removePlayerFromMatch(matchId, playerId)
    if (typeof res === 'string') {
      logError(playerId, matchId, LEAVE_MATCH, res)
      return
    }
    return { match: res }
  }
});

listenToChannel<MatchReady, StartMatch>({
  from: MATCH_READY,
  replyTo: GAME_MANAGEMENT_CHANNELS.START_MATCH,
  fn: async ({ playerId }) => {
    const matchId = await getPlayerMatchId(playerId)
    if (!matchId) {
      logError(playerId, '[not found]', MATCH_READY, 'Match not found')
      return
    }

    const match = await getMatch(matchId)
    if (!match) {
      logError(playerId, matchId, MATCH_READY, 'Player has matchId that does not exist')
      return
    }

    const isHost = match.hostId === playerId
    if (!isHost) {
      logError(playerId, matchId, MATCH_READY, 'Player doesn\'t have host permissions')
      return
    }

    return { match }
  }
})