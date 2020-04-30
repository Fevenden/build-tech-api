require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const buildsRouter = require('./builds/builds-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

const whitelist = [
  'https://fallout-4-build-manager.now.sh/',
  'https://fallout-4-build-manager.now.sh/register',
  'https://fallout-4-build-manager.now.sh/login'

]
const corsOptions = {

}

app.use(morgan(morganOption))
app.use(helmet())
app.use(
  cors({
    origin: 'https://fallout-4-build-manager.now.sh'
  })
)
app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: 'server error' }
  } else {
    response = { message: error.message, object: error}
  }
  res.status(500).json(response)
})

app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/builds', buildsRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})


module.exports = app
