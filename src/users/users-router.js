const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { user_password, username, full_name, email} = req.body

    for (const field of ['full_name', 'username', 'user_password', 'email']) {
      if(!req.body[field]) {
        res.status(400).json({
          error: `Missing '${field}' in request body`
        })
      }
    }
        
    const passwordError = UsersService.validatePassword(user_password)

    if (passwordError) {
      return res.status(400).json({error: passwordError})
    }

    UsersService.hasUserWithUsername(
      req.app.get('db'),
      username
    )
      .then(hasUserwithUsername => {
        if (hasUserwithUsername)
          return res.status(400).json({error: `Username already taken`})
  
          return UsersService.hashPassword(user_password)
            .then(hashedPassword => {
              const newUser = {
                username,
                user_password: hashedPassword,
                full_name,
                email,
                date_created: 'now()',
              }

              UsersService.insertUser(
                req.app.get('db'),
                newUser
              )
                .then(user => 
                  res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(UsersService.serializeUser(user))
                )
            })
      })
      .catch(error => {
        console.log(error)
        next(error)
      })
})

module.exports = usersRouter
