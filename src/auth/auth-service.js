const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
  getUserWithUsername(db, username) {
    return db('users')
      .where({username})
      .first()
  },

  comparePassword(password, hash) {
    return bcrypt.compare(password, hash)
  },

  parseBasicToken(token) {
    return Buffer
      .from(token, 'base64')
      .toString()
      .split(':')
  },

  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256',
    })
  },

  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithm: ['HS256']
    })
  }
}

module.exports = AuthService