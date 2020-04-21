const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { user_password, username, full_name, email} = req.body

    // return res.status(201).send('ok')

    for (const field of ['full_name', 'username', 'user_password', 'email'])
      if(!req.body[field]) 
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
        
    const passwordError = UsersService.validatePassword(user_password)

    if (passwordError) 
      return res.status(400).json({error: passwordError})
    
    UsersService.hasUserwithUsername(
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
      .catch(next)
})

module.exports = usersRouter
