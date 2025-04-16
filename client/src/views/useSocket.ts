import { io } from 'socket.io-client'
import { useState, useMemo } from 'react'
import type { ClientSocketInstance } from 'shared-types/dist/socket-gateway'
import type { Player } from 'shared-types/dist/match-making';

const IS_PROD = window.location.hostname !== 'localhost';
const LOCAL_SOCKET_URL = 'http://localhost:3000';
const PROD_SOCKET_URL = '/';

export const SOCKET_URL = IS_PROD ? PROD_SOCKET_URL : LOCAL_SOCKET_URL;

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

      socketInstance.on('matchMaking.responseJoinMatch', (data) => {
        console.log('matchMaking.responseJoinMatch', data);
      });
    });

  const register = (playerId: Player['id']) => {
    if (!activeSocket) throw new Error('socket not connected');
    activeSocket.emit('socketGateway.register', {
      playerId,
    }, () => console.log('socketGateway.register ack'));
  }

  const join = (playerId: Player['id']) => {
    if (!activeSocket) throw new Error('socket not connected');
    activeSocket.emit('matchMaking.requestJoinMatch', {
      matchId: 'abc123',
      player: {
        id: playerId,
        name: 'John Doe',
        avatar: 'https://example.com/avatar.png',
        color: '#FF0000',
      },
      teamIndex: 0,
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
    register,
    join,
  }
}