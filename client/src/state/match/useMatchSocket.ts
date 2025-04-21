import { useCallback } from 'react';
import type { ClientSocketInstance } from 'shared-types/dist/socket-gateway';
import type { Match, Player, TeamIndex } from 'shared-types/dist/match-making';
import type { MatchActionDispatcher } from './matchReducer';
import { MATCH_ACTIONS } from './MatchActions';
import { getPlayerObj } from './utils';
import { useNavigate } from 'react-router';
import { io, type Socket } from 'socket.io-client';

type EventsMap = {
  // eslint-disable-next-line
  [event: string]: any;
}

export type ConnectSocketOptions<T extends EventsMap, K extends EventsMap> = {
  url: string,
  onConnected?: (socket: Socket<T, K>) => void,
  onDisconnected?: (socket: Socket<T, K>) => void,
  onError?: (err: Error) => void,
}

export const connectSocket = <T extends EventsMap, K extends EventsMap>(options: ConnectSocketOptions<T, K>) => {
  const socketInstance: Socket<T, K> = io(options.url);

  return new Promise<Socket<T, K>>((resolve, reject) => {
    socketInstance.on('connect', () => {
      resolve(socketInstance)
      options.onConnected?.(socketInstance)
    });

    socketInstance.on('connect_error', (err) => {
      reject(err);
      options.onError?.(err)
    });

    socketInstance.on('disconnect', () => {
      options.onDisconnected?.(socketInstance)
    });
  });
}

export const useMatchSocketListeners = (matchDispatcher: MatchActionDispatcher) => {
  const navigate = useNavigate()

  return (socket: ClientSocketInstance) => {
    if (!socket) return

    socket.on('matchMaking.responseCreateMatch', (data) => {
      console.log('matchMaking.responseCreateMatch', data);
      navigate('/')
    });

    socket.on('matchMaking.responseJoinMatch', (data) => {
      console.log('matchMaking.responseJoinMatch', data);
      navigate('/')
    });

    socket.on('matchMaking.playerJoined', ({ match }) => {
      console.log('matchMaking.playerJoined', match);
      matchDispatcher({ type: MATCH_ACTIONS.SET_LIVE_MATCH, payload: match });
    });

    socket.on('matchMaking.playerLeft', ({ match }) => {
      console.log('matchMaking.playerLeft', match);
      matchDispatcher({ type: MATCH_ACTIONS.SET_LIVE_MATCH, payload: match });
    });
  }
};

export const useMatchSocketEmitters = (socket: ClientSocketInstance | null) => {
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

export type MatchSocketEventEmitters = ReturnType<typeof useMatchSocketEmitters>