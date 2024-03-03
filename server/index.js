import express from 'express'
import logger from 'morgan'

const port = process.env.PORT ?? 3000

const app = express()
app.use(logger('dev')) // logger de http request en consola

app.get('/', (req, res) => {
  res.send('<h1>Esto es el chat</h1>')
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})