const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
  const authToken = req.get('Authoriozation') || ''

  let bearerToken
  !authToken.toLowerCase().startsWith('bearer ')
    ? res.status(401).json({ error: 'Missing bearer token'})
    : bearerToken = authToken.slice(7, authToken.length)

  try {
    const payload = AuthService.verifyJwt(bearerToken)

    AuthService.getUserWithUsername(
      req.app.get('db'),
      payload.sub
    )
      .then(user => {
        if (!user)
          return res.status(401).json({error: 'Unauthorized request'})

        req.user = user
        next()
      })
      .catch(err => {
        console.error(err)
        next(err)
      })
  } catch(error) {
    res.status(401).json({error: 'Unauthorized request'})
  }
}

module.exports = {
  requireAuth,
}