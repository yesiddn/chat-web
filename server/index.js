import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client' // importar el cliente de libsql para conectarse a la base de datos

import { Server } from 'socket.io'
import { createServer } from 'node:http'

dotenv.config() // carga las variables de entorno desde el archivo .env

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: true, // habilita la recuperación de estado de conexión
}) // io -> in and out

const db = createClient({
  url: "libsql://chat-web-yesiddn.turso.io", // url de la base de datos
  authToken: process.env.DB_TOKEN, // token de autenticación
})

await db.execute(`
CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, user TEXT)`) // crea la tabla si no existe

io.on('connection', async (socket) => {
  console.log('an user has connected')

  socket.on('disconnect', () => {
    console.log('an user has disconnected')
  })

  socket.on('chat message', async (msg) => {
    let result
    const username = socket.handshake.auth.username ?? 'anonymous' // obtener el nombre de usuario del socket

    try {
      result = await db.execute(
        {
          sql: 'INSERT INTO messages(message, user) VALUES(:msg, :username)',
          args: {
            msg,
            username
          }
        }
      )
    } catch (error) {
      console.error(error)
      return
    }

    io.emit('chat message', msg, result.lastInsertRowid.toString(), username) // envia el mensaje a todos los usuarios conectados y además el id del mensaje
  })

  // console.log('auth: ', socket.handshake.auth) // imprime los datos de autenticación del socket (si es que hay alguno

  if (!socket.recovered) { // recuperar mensajes que se han enviado despues de perder la conexión
    try {
      const results = await db.execute({
        sql: `SELECT * FROM messages WHERE id > ?`,
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      results.rows.forEach(row => {
        socket.emit('chat message', row.message, row.id.toString(), row.user) // envia el mensaje al usuario que se ha reconectado
      })
    } catch (error) {
      console.error(error)
      return
    }
  }
})

app.use(logger('dev')) // logger de http request en consola

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html') // servir un archivo estático usando process current working directory
})

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})