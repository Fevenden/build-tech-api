const express = require('express')
const BuildsService = require('./builders-service')
const { requireAuth } = require('../middleware/jwt-auth')

const buildsRouter = express.Router()

buildsRouter
  .route('/')
  // .all(requireAuth)
  .get((req, res, next) => {
      BuildsService.getAllUsersBuilds(req.app.get('db'))
      // .then(console.log)
        .then(builds => {
          // res.json(BuildsService.serializeBuilds(builds))
          console.log(BuildsService.serializeBuilds(builds))
        })
        .catch(error => {
          console.log(error)
          next(error)
        })
  })

module.exports = buildsRouter