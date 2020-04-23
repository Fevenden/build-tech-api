const express = require('express')
const BuildsService = require('./builders-service')
const { requireAuth } = require('../middleware/jwt-auth')

const thingsRouter = express.Router()

thingsRouter
  .route('/')
  // .all(requireAuth)
  .get((req, res, next) => {
    BuildsService.getAllUsersBuilds(req.app.get('db'))
      .then(builds => {
        console.log(builds)
        res.json(BuildsService.serializeBuilds(builds))
      })
      .catch(error => {
        console.log(error)
        next(error)
      })
  })

module.exports = thingsRouter