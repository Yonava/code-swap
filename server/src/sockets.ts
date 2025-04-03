import { Server } from 'socket.io'
import { createServer } from 'http'

type SocketEvent = {
  join: (userId: string, ack: () => void) => void
}

export const sockets = (httpServer: ReturnType<typeof createServer>) => {
  const io = new Server<SocketEvent, SocketEvent, {}, {}>(httpServer, {
    cors: {
      origin: '*',
    },
  })

  io.on('connection', (socket) => {

    console.log('socket connected', socket.id)
    console.log('number of sockets connected', io.engine.clientsCount)

    socket.on('join', async (userId, ack) => {
      console.log(`User ${userId} joined`)
      ack()
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id)
      console.log('number of sockets connected', io.engine.clientsCount)
    })

    socket.on('error', (error) => {
      console.error(error)
    })
  })

  return io
}