import express from 'express'
import logger from 'morgan'

const port = process.env.PORT ?? 3000

const app = express()
app.use(logger('dev')) // logger de http request en consola

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html') // servir un archivo estático usando process current working directory
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})