import { io, type Socket } from 'socket.io-client'
import { useState, useMemo } from 'react'

const IS_PROD = window.location.hostname !== 'localhost';
const LOCAL_SOCKET_URL = 'http://localhost:3000';
const PROD_SOCKET_URL = '/';

export const SOCKET_URL = IS_PROD ? PROD_SOCKET_URL : LOCAL_SOCKET_URL;

type SocketEvent = {
  join: (userId: string, ack: () => void) => void
}

export const useSocket = () => {
  const [activeSocket, setActiveSocket] = useState<Socket<SocketEvent, SocketEvent> | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  /**
   * connects the user to the socket server.
   * @returns a promise that resolves with the socket instance when connected
   */
  const connect = async () =>
    new Promise<Socket<SocketEvent, SocketEvent>>((res, rej) => {
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
    });

  const join = (userId: string) => {
    if (!activeSocket) throw new Error('socket not connected');
    activeSocket.emit('join', userId, () => {
      console.log('join ack received from server for', userId);
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