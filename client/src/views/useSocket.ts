import { io, type Socket } from 'socket.io-client'
import { useState, useMemo } from 'react'

const IS_PROD = window.location.hostname !== 'localhost';
const LOCAL_SOCKET_URL = 'http://localhost:3000';
const PROD_SOCKET_URL = '/';

export const SOCKET_URL = IS_PROD ? PROD_SOCKET_URL : LOCAL_SOCKET_URL;

export type Player = {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export type Match = {
  id: string;
  teams: {
    team1: Player[];
    team2: Player[];
  },
  host: string;
}

// a request to join from a user results in either a response confirmation with the match data or a rejection
export type JoinRequest = {
  player: Player;
  matchId: string;
  team: 1 | 2;
}

export type JoinResponseAccepted = {
  match: Match;
}

export type JoinResponseRejected = {
  error: string;
}

export type JoinResponse = { playerId: Player['id'] } & (JoinResponseAccepted | JoinResponseRejected)

// export type Leave = {}

type ClientSocketEvents = {
  requestJoin: (req: JoinRequest) => void,
}

type ServerSocketEvents = {
  responseJoin: (res: JoinResponse) => void,
}

type SocketConnection = Socket<ServerSocketEvents, ClientSocketEvents>;

export const useSocket = () => {
  const [activeSocket, setActiveSocket] = useState<SocketConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  /**
   * connects the user to the socket server.
   * @returns a promise that resolves with the socket instance when connected
   */
  const connect = async () =>
    new Promise<SocketConnection>((res, rej) => {
      if (activeSocket) return res(activeSocket)
      setIsConnecting(true);

      const socketInstance = io(SOCKET_URL);

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

      socketInstance.on('responseJoin', (data: JoinResponse) => {
        console.log('responseJoin', data);
      });
    });

  const join = (playerId: Player['id']) => {
    if (!activeSocket) throw new Error('socket not connected');
    activeSocket.emit('requestJoin', {
      matchId: 'abc123',
      player: {
        id: playerId,
        name: 'John Doe',
        avatar: 'https://example.com/avatar.png',
        color: '#FF0000',
      },
      team: 1,
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
    join,
  }
}