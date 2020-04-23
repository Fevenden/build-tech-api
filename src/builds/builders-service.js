const Treeize = require('treeize')
const xss = require('xss')

const BuildsService = {
  getAllUsersBuilds(db) {
    return db
      .from('builds AS build')
      .select(
        'build.id',
        'build.title',
        'build.description',
        'build.user_id'
      )
  },

  getById(db, id) {
    return buildsService.getAllThings(db)
      .where('user.id', id)
      .first()
  },

  getStatsForBuild(db, buildId) {
    return db 
      .from('stats AS stat')
      .select(
        'stat.id',
        'stat.title',
        'stat_value',
      )
      .where('stat.build', buildId)
  },

  getPerksForBuild(db, buildId) {
    return db 
      .from('perks AS perk')
      .select(
        'perk.id',
        'perk.title',
        'perk.stat_title',
        'perk.stat_rank',
        'perk.perk_rank',
        'perk.perk_description'
      )
      .where('perk.build', buildId)
  },

  serializeBuild(build) {
    const BuildTree = new Treeize()

    const buildData = BuildTree.grow([build]).getData()[0]

    return {
      id: buildData.id,
      title: xss(buildData.title),
      description: xss(buildData.description),
      user_id: buildData.user_id
    }
  },

  serializeBuilds(builds) {
    return builds.map(this.serializeBuild)
  },

  serializeStat(stat) {
    const statTree = new Treeize()

    const statData = statTree.grow([stat]).getData()[0]

    return {
      id: statData.id,
      title: stat.title,
      stat_value: stat.stat_value,
      build_id: statTree.build_id,
    }
  },

  serializeStats(stats) {
    return stats.map(this.serializeStat) 
  }
}

// const userFields = [
//   'user.id AS user:id',
//   'user.username AS user:username',
//   'user.full_name AS user:username',
//   'user.email AS user:email',
//   'user.date_created AS user:date_created',
//   'user.date_modified AS user:date_modified',
// ]

module.exports = BuildsService