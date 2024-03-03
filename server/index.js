import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server) // io -> in and out

io.on('connection', (socket) => {
  console.log('an user has connected')

  socket.on('disconnect', () => {
    console.log('an user has disconnected')
  })
})

app.use(logger('dev')) // logger de http request en consola

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html') // servir un archivo estático usando process current working directory
})

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})