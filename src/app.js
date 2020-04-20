require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config');
const authRouter = require('./auth/auth-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(function errorHandler(error, req, res, next) {
  let response 
  if (NODE_ENV === 'production') {
    response = { error: 'server error' } 
  } else {
    console.error(error)
    response = { message: error.message, object: error}
  } 
  res.status(500).json(response)
})

app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})


module.exports = app