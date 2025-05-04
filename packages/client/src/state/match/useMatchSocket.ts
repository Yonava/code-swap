import { useCallback } from 'react';
import type { ClientSocketInstance } from 'shared-types/dist/socket-gateway';
import type { Match, Player, TeamIndex } from 'shared-types/dist/match-making';
import { MATCH_ACTIONS } from './MatchActions';
import { getPlayerObj } from './utils';
// import { useNavigate } from 'react-router';
import { io, type Socket } from 'socket.io-client';

type EventsMap = {
  // eslint-disable-next-line
  [event: string]: any;
};

export type ConnectSocketOptions<T extends EventsMap, K extends EventsMap> = {
  url: string;
  onConnected?: (socket: Socket<T, K>) => void;
  onDisconnected?: (socket: Socket<T, K>) => void;
  onError?: (err: Error) => void;
};

export const connectSocket = <T extends EventsMap, K extends EventsMap>(
  options: ConnectSocketOptions<T, K>
) => {
  const socketInstance: Socket<T, K> = io(options.url);

  return new Promise<Socket<T, K>>((resolve, reject) => {
    socketInstance.on('connect', () => {
      resolve(socketInstance);
      options.onConnected?.(socketInstance);
    });

    socketInstance.on('connect_error', (err) => {
      reject(err);
      options.onError?.(err);
    });

    socketInstance.on('disconnect', () => {
      options.onDisconnected?.(socketInstance);
    });
  });
};

import { matchCtxRef } from './MatchContext';
import {
  UpdateCodeSubmission,
} from 'shared-types/dist/game-management';

export const useMatchSocketListeners = () => {
  // const navigate = useNavigate();

  return (socket: ClientSocketInstance) => {
    if (!socket) return;

    // socket.on('matchMaking.responseCreateMatch', () => {
    //   navigate('/');
    // });

    // socket.on('matchMaking.responseJoinMatch', () => {
    //   navigate('/');
    // });

    socket.on('matchMaking.playerJoined', ({ match }) => {
      matchCtxRef.current.dispatch({
        type: MATCH_ACTIONS.SET_LIVE_MATCH,
        payload: match,
      });
    });

    socket.on('matchMaking.playerLeft', ({ match }) => {
      matchCtxRef.current.dispatch({
        type: MATCH_ACTIONS.SET_LIVE_MATCH,
        payload: match,
      });
    });

    socket.on(
      'gameManagement.startChallenge',
      ({ endsAt, challenges }) => {
        console.log('gameManagement.startChallenge');
        const ctx = matchCtxRef.current;

        ctx.dispatch({
          type: MATCH_ACTIONS.SET_CHALLENGE,
          payload: {
            endsAt,
            ...challenges[ctx.playerId]
          },
        });

        ctx.dispatch({
          type: MATCH_ACTIONS.SET_NEW_CHALLENGE_TIME,
          payload: undefined,
        });
      }
    );

    socket.on('gameManagement.endChallenge', (data) => {
      console.log('gameManagement.endChallenge', data);
      matchCtxRef.current.dispatch({
        type: MATCH_ACTIONS.SET_NEW_CHALLENGE_TIME,
        payload: data.startsAt,
      });
    });

    socket.on('gameManagement.matchEnding', (data) => {
      console.log('gameManagement.matchEnding', data)

      const ctx = matchCtxRef.current;

      ctx.dispatch({
        type: MATCH_ACTIONS.SET_NEW_CHALLENGE_TIME,
        payload: undefined,
      });

      ctx.dispatch({
        type: MATCH_ACTIONS.SET_MATCH_END_TIME,
        payload: data.at
      })
    })

    socket.on('gameManagement.matchEnded', () => {
      console.log('gameManagement.matchEnded')
      matchCtxRef.current.dispatch({ type: MATCH_ACTIONS.SET_SCOREBOARD, payload: 'loading' })
    })

    socket.on('scoring.matchResult', (data) => {
      matchCtxRef.current.dispatch({ type: MATCH_ACTIONS.SET_SCOREBOARD, payload: data })
    })
  };
};

export const useMatchSocketEmitters = (socket: ClientSocketInstance | null) => {
  const createMatch = useCallback(
    (playerId: Player['id']) => {
      if (!socket) return console.warn('socket left unset');

      socket.emit('matchMaking.requestCreateMatch', {
        player: getPlayerObj(playerId),
      });
    },
    [socket]
  );

  const joinMatch = useCallback(
    (playerId: Player['id'], matchId: Match['id'], teamIndex: TeamIndex) => {
      if (!socket) return console.warn('socket left unset');

      socket.emit('matchMaking.requestJoinMatch', {
        matchId,
        teamIndex,
        player: getPlayerObj(playerId),
      });
    },
    [socket]
  );

  const leaveMatch = useCallback(() => {
    if (!socket) return console.warn('socket left unset');

    socket.emit('matchMaking.leaveMatch');
    socket.disconnect();
  }, [socket]);

  const matchReady = useCallback(() => {
    if (!socket) return console.warn('socket left unset');

    socket.emit('matchMaking.matchReady');
  }, [socket]);

  const updateCodeSubmission = useCallback(
    (data: UpdateCodeSubmission) => {
      if (!socket) return console.warn('socket left unset');

      socket.emit('gameManagement.updateCodeSubmission', data);
    },
    [socket]
  );

  return {
    createMatch,
    joinMatch,
    leaveMatch,
    matchReady,
    updateCodeSubmission,
  };
};

export type MatchSocketEventEmitters = ReturnType<
  typeof useMatchSocketEmitters
>;
