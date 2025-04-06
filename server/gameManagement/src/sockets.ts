import { Server } from 'socket.io'
import { createServer } from 'http'

type ClientSocketEvents = {
  join: (userId: string, ack: () => void) => void,
  clientToServerSync: (payload: { userId: string, codeEditorState: string }) => void,
}

type ServerSocketEvents = {
  serverToClientSync: (payload: { timeUntilSwapMs: number }) => void,
}

export type SocketServer = Server<ClientSocketEvents, ServerSocketEvents, {}, {}>

export const sockets = (httpServer: ReturnType<typeof createServer>) => {
  const io: SocketServer = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  })

  const userToCodeEditorState: Record<string, string> = {}

  io.on('connection', (socket) => {

    console.log('socket connected', socket.id)
    console.log('number of sockets connected', io.engine.clientsCount)

    socket.on('join', async (userId, ack) => {
      console.log(`User ${userId} joined`)
      ack()
    })

    socket.on('clientToServerSync', ({ userId, codeEditorState }) => {
      userToCodeEditorState[userId] = codeEditorState
      console.log(`User ${userId} updated code editor state`, userToCodeEditorState)
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