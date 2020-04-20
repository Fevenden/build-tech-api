const express = require('express')
const logger = require('../logger')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { username, user_password } = req.body
    const loginUser = { username, user_password }

    for (const [key, value] of Object.entries(loginUser))
      if (value == null) {
        logger.error('missing either username or password')
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
            const payload = { user_id: dbUser.id}
            res.send({
              authToken: AuthService.createJwt(sub, payload),
            })
          })
      })
      .catch(next) 
  })

module.exports = authRouter
