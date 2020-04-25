const express = require('express')
const BuildsService = require('./builders-service')
const { requireAuth } = require('../middleware/jwt-auth')

const buildsRouter = express.Router()

buildsRouter
  .route('/')
  // .all(requireAuth)
  .get((req, res, next) => {
      BuildsService.getAllUsersBuilds(req.app.get('db'))
        .then(builds => 
          BuildsService.serializeBuilds(builds)
        )
        .then(builds => 
          BuildsService.getStats(req.app.get('db'))
            .then(stats => 
              BuildsService.serializeStats(stats)
            )
            .then(stats => 
              BuildsService.getPerks(req.app.get('db'))
                .then(perks => 
                  BuildsService.serializePerks(perks)
                )
                .then(perks => 
                  builds.map(build => {
                    const buildPerks = perks.filter(perk => perk.build_id === build.id)
                    return {
                      ...build,
                      stats: stats.filter(stats => stats.build_id === build.id).map(stat => {
                        return {
                          ...stat,
                          perks: buildPerks.filter(perk => perk.stat_title === stat.title)
                        }
                      })
                    }
                  })
                )
                .then(r => res.json(r))
            )
        )
        .catch(error => {
          console.log(error)
          next(error)
        })
  })

module.exports = buildsRouter