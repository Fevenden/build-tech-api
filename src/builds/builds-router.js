const express = require('express')
const BuildsService = require('./builders-service')
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')

const buildsRouter = express.Router()
const jsonBodyParser = express.json()

buildsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
      BuildsService.getAllUsersBuilds(req.app.get('db'), req.user.id)
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
          next(error)
        })
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { title, description, required_level, stats } = req.body
    const newBuild = {user_id: req.user.id, title, description, required_level}
    const perks = []

    stats.map(s => {
        if (s.perks.length !== 0)
          s.perks.forEach(p => {
            if(p !== null) {
              perks.push(p)
            }
          })
    })

    BuildsService.insertBuild(req.app.get('db'), newBuild, newBuild.user_id)
      .then(build =>
        BuildsService.insertStats(req.app.get('db'), stats, build.id)
          .then(stats =>
            BuildsService.insertPerks(req.app.get('db'), perks, build.id)
              .then(perks => {
                const results = {
                  build,
                  stats,
                  perks
                }
                res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${build.id}`))
                .json(results)
              })
          )
      )
      .catch(err => {
        next(err)
      })
  })

buildsRouter
  .route('/:build_id')
  .all(requireAuth)
  .all(checkBuildExists)
  .get((req, res, next) => {
    BuildsService.getStatsForBuild(req.app.get('db'), res.build.id)
      .then(stats =>
        BuildsService.serializeStats(stats)
      )
      .then(stats =>
        BuildsService.getPerksForBuild(req.app.get('db'), res.build.id)
          .then(perks =>
            BuildsService.serializePerks(perks)
          )
          .then(perks => {
            const build = [BuildsService.serializeBuild(res.build)].map(build => {
              return {
                ...build,
                stats: stats.map(stat => {
                  return {
                    ...stat,
                    perks: perks.filter(perk => perk.stat_title === stat.title)
                  }
                })
              }
            })

            res.json(build[0])
          })
      ).catch(err => {
          next(err)
        })
  })
  .delete((req, res, next) => {
    BuildsService.deleteBuild(
      req.app.get('db'),
      req.params.build_id,
      req.user.id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(err => {
        next(err)
      })
  })

async function checkBuildExists(req, res, next) {
  try {
    const build = await BuildsService.getBuildById(
      req.app.get('db'),
      req.params.build_id,
      req.user.id
    )

    if(!build)
      return res.status(404).json({
        error: `Build doesn't exist`
      })

    res.build = build
    next()
  } catch (error) {
    next(error)
  }
}
module.exports = buildsRouter
