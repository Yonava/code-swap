import { Server } from 'socket.io'
import { createServer } from 'http'

type SocketEvent = {
  join: (userId: string, ack: () => void) => void,
  userCodeEditorStateUpdate: (userId: string, codeEditorState: string) => void,
}

export const sockets = (httpServer: ReturnType<typeof createServer>) => {
  const io = new Server<SocketEvent, SocketEvent, {}, {}>(httpServer, {
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

    socket.on('userCodeEditorStateUpdate', (userId, codeEditorState) => {
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