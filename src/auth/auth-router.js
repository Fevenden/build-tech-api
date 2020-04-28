const express = require('express')
const logger = require('../logger')
const AuthService = require('./auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { username, user_password } = req.body
    const loginUser = { username, user_password }

    for (const [key, value] of Object.entries(loginUser))
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    }

    AuthService.getUserWithUsername(
      req.app.get('db'),
      loginUser.username
    )
      .then(dbUser => {
        if(!dbUser)
          return res.status(400).json({
            error: 'Incorrect Username or password'
          })

        return AuthService.comparePassword(loginUser.user_password, dbUser.user_password)
          .then(match => {
            if (!match)
              return res.status(400).json({
                error: 'Incorrect Username or password'
              })

            const sub = dbUser.username
            const payload = { id: dbUser.id}
            res.send({
              authToken: AuthService.createJwt(sub, payload),
            })
          })
      })
      .catch(next) 
  })

authRouter
  .post('/refresh', requireAuth, (req, res) => {
    const sub = req.user.username
    const payload = { id: req.user.id}
    res.send({
      authToken: AuthService.createJwt(sub, payload)
    })
    .catch(err => console.log(err))
  })

module.exports = authRouter
