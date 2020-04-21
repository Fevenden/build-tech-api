const bcrypt = require('bcryptjs')
const xss = require('xss')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  hasUserWithUsername(db, username) {
    return db('users')
      .where({ username })
      .first()
      .then(user => !!user)
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user)
  },

  validatePassword(password) {
    if (password.length <= 7) {
      return 'Password must be at least 8 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endWith(' ')) {
      return 'password must not start or end with empy spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number, and special character'
    }
    return null
  },

  hashPassword(password) {
		return bcrypt.hash(password, 12)
  },

  serializeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.full_name),
      username: xss(user.username),
      email: xss(user.email),
      date_created: new Date(user.date_created)
    }
  },
}

module.exports = UsersService