import { io } from 'socket.io-client'
import { useState, useMemo } from 'react'
import type { ClientSocketInstance } from 'shared-types/dist/socket-gateway'
import type { Match, Player } from 'shared-types/dist/match-making';

const IS_PROD = window.location.hostname !== 'localhost';
const LOCAL_SOCKET_URL = 'http://localhost:3000';
const PROD_SOCKET_URL = '/';

export const SOCKET_URL = IS_PROD ? PROD_SOCKET_URL : LOCAL_SOCKET_URL;

const registerSocketListeners = (socket: ClientSocketInstance) => {
  socket.on('matchMaking.responseCreateMatch', (data) => {
    console.log('matchMaking.responseCreateMatch', data);
  })

  socket.on('matchMaking.responseJoinMatch', (data) => {
    console.log('matchMaking.responseJoinMatch', data);
  })

  socket.on('matchMaking.playerJoined', (data) => {
    console.log('matchMaking.playerJoined', data)
  })

  socket.on('matchMaking.playerLeft', (data) => {
    console.log('matchMaking.playerLeft', data)
  })
}

const getPlayerObj = (playerId: Player['id']) => ({
  id: playerId,
  name: 'John Doe',
  avatar: 'https://example.com/avatar.png',
  color: '#FF0000',
})

export const useSocket = () => {
  const [activeSocket, setActiveSocket] = useState<ClientSocketInstance | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  /**
   * connects the user to the socket server.
   * @returns a promise that resolves with the socket instance when connected
   */
  const connect = async () =>
    new Promise<ClientSocketInstance>((res, rej) => {
      if (activeSocket) return res(activeSocket)
      setIsConnecting(true);

      const socketInstance: ClientSocketInstance = io(SOCKET_URL);

      socketInstance.on('connect', () => {
        if (!socketInstance) throw new Error('this should never happen');
        console.log('socket connected');
        setActiveSocket(socketInstance);
        setIsConnecting(false);
        registerSocketListeners(socketInstance);
        res(socketInstance);
      });

      socketInstance.on('connect_error', (err) => {
        console.error('socket connection error', err);
        rej(err);
        setActiveSocket(null);
        setIsConnecting(false);
      });

      socketInstance.on('disconnect', () => {
        console.log('socket disconnected');
        setActiveSocket(null);
        setIsConnecting(false);
      });
    });

  const joinMatch = (playerId: Player['id'], matchId: Match['id']) => {
    if (!activeSocket) throw new Error('socket not connected');
    activeSocket.emit('matchMaking.requestJoinMatch', {
      matchId,
      player: getPlayerObj(playerId),
      teamIndex: 0,
    });
  }

  const leaveMatch = () => {
    if (!activeSocket) throw new Error('socket not connected');
    activeSocket.emit('matchMaking.leaveMatch')
    activeSocket.disconnect()
  }

  const createMatch = (playerId: Player['id']) => {
    if (!activeSocket) throw new Error('socket not connected');
    activeSocket.emit('matchMaking.requestCreateMatch', {
      player: getPlayerObj(playerId)
    });
  }

  const isConnected = useMemo(() => {
    if (!activeSocket) return false;
    return activeSocket.connected;
  }, [activeSocket]);

  return {
    connect,
    isConnected,
    isConnecting,
    activeSocket,
    createMatch,
    joinMatch,
    leaveMatch,
  }
}