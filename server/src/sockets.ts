import { Server } from 'socket.io'
import { createServer } from 'http'

type SocketEvent = {
  join: (userId: string) => void
}

export const sockets = (httpServer: ReturnType<typeof createServer>) => {
  const io = new Server<SocketEvent, SocketEvent, {}, {}>(httpServer, {
    cors: {
      origin: '*',
    },
  })

  io.on('connection', (socket) => {

    socket.on('join', async (userId) => {
      console.log(`User ${userId} connected`)
    })

    socket.on('disconnect', () => {

    })

    socket.on('error', (error) => {
      console.error(error)
    })
  })

  return io
}