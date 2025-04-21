import { useCallback } from 'react';
import type { ClientSocketInstance } from 'shared-types/dist/socket-gateway';
import type { Match, Player, TeamIndex } from 'shared-types/dist/match-making';
import type { MatchActionDispatcher } from './MatchContext';
import { MATCH_ACTIONS } from './MatchActions';
import { getPlayerObj } from './utils';

export const registerSocketListeners = (
  socket: ClientSocketInstance,
  matchDispatcher: MatchActionDispatcher
) => {
  socket.on('matchMaking.responseCreateMatch', (data) => {
    console.log('matchMaking.responseCreateMatch', data);
  });

  socket.on('matchMaking.responseJoinMatch', (data) => {
    console.log('matchMaking.responseJoinMatch', data);
  });

  socket.on('matchMaking.playerJoined', ({ match }) => {
    console.log('matchMaking.playerJoined', match);
    matchDispatcher({ type: MATCH_ACTIONS.SET_LIVE_MATCH, payload: match });
  });

  socket.on('matchMaking.playerLeft', ({ match }) => {
    console.log('matchMaking.playerLeft', match);
    matchDispatcher({ type: MATCH_ACTIONS.SET_LIVE_MATCH, payload: match });
  });
};

export const useMatchSocketEventEmitters = (socket: ClientSocketInstance | null) => {
  const createMatch = useCallback((playerId: Player['id']) => {
    if (!socket) return console.warn('socket left unset')

    socket.emit('matchMaking.requestCreateMatch', {
      player: getPlayerObj(playerId)
    });
  }, [socket])

  const joinMatch = useCallback(
    (playerId: Player['id'], matchId: Match['id'], teamIndex: TeamIndex) => {
      if (!socket) return console.warn('socket left unset')

      socket.emit('matchMaking.requestJoinMatch', {
        matchId,
        teamIndex,
        player: getPlayerObj(playerId),
      });
    },
    [socket]
  );

  const leaveMatch = useCallback(() => {
    if (!socket) return console.warn('socket left unset')

    socket.emit('matchMaking.leaveMatch');
    socket.disconnect();
  }, [socket]);

  return {
    createMatch,
    joinMatch,
    leaveMatch
  }
};

export type MatchSocketEventEmitters = ReturnType<typeof useMatchSocketEventEmitters>