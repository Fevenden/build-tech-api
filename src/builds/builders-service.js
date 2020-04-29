const Treeize = require('treeize')
const xss = require('xss')

const BuildsService = {
  getAllUsersBuilds(db, userId) {
    return db
      .from('builds AS build')
      .distinctOn('build.id')
      .select(
        'build.id',
        'build.required_level',
        'build.title',
        'build.description',
        'build.user_id',
      )
      .where('build.user_id', userId)
  },

  getBuildById(db, buildId, userId) {
    return this.getAllUsersBuilds(db, userId)
      .where('build.id', buildId)
      .first()
  },

  getStats(db) {
    return db
      .from('stats AS stat')
      .select(
        'stat.id',
        'stat.build_id',
        'stat.title',
        'stat_value',
      )
  },

  getStatsForBuild(db, buildId) {
    return db
      .from('stats AS stat')
      .distinctOn('stat.id')
      .select(
        'stat.id',
        'stat.build_id',
        'stat.title',
        'stat_value'
      )
      .where('stat.build_id', buildId)
  },

  getPerks(db) {
    return db
      .from('perks AS perk')
      .distinctOn('perk.id')
      .select(
        'perk.id',
        'perk.title',
        'perk.build_id',
        'perk.stat_title',
        'perk.stat_rank',
        'perk.perk_rank',
        'perk.perk_description'
      )
  },

  getPerksForBuild(db, buildId) {
    return db
      .from('perks AS perk')
      .distinctOn('perk.id')
      .select(
        'perk.id',
        'perk.title',
        'perk.build_id',
        'perk.stat_title',
        'perk.stat_rank',
        'perk.perk_rank',
        'perk.perk_description'
      )
      .where('perk.build_id', buildId)
  },

  deleteBuild(db, buildId, userId) {
    return db
      .from('builds')
      .where('builds.id', buildId )
      .where('builds.user_id', userId )
      .delete()
  },

  serializeBuild(build) {
    const BuildTree = new Treeize()

    const buildData = BuildTree.grow([build]).getData()[0]

    return {
      id: buildData.id,
      title: xss(buildData.title),
      required_level: buildData.required_level,
      description: xss(buildData.description),
      user_id: buildData.user_id,
    }
  },

  serializeBuilds(builds) {
    return builds.map(build => this.serializeBuild(build))
  },

  serializeStat(stat) {
    const statTree = new Treeize()

    const statData = statTree.grow([stat]).getData()[0]

    return {
      id: statData.id,
      title: statData.title,
      stat_value: statData.stat_value,
      build_id: statData.build_id,
    }
  },

  serializeStats(stats) {
    return stats.map(stat => this.serializeStat(stat))
  },

  serializePerk(perk) {
    const perkTree = new Treeize()

    const perkData = perkTree.grow([perk]).getData()[0]

    return {
      id: perkData.id,
      title: perkData.title,
      build_id: perkData.build_id,
      stat_title: perkData.stat_title,
      stat_rank: perkData.stat_rank,
      perk_rank: perkData.perk_rank,
      perk_description: perkData.perk_description,
    }
  },

  serializePerks(perks) {
    return perks.map(this.serializePerk)
  },

  insertBuild(db, newBuild, userId) {
    return db
      .insert(newBuild)
      .into('builds')
      .returning('*')
      .then(([build]) => build)
      .then(build =>
        BuildsService.getBuildById(db, build.id, userId)
      )
  },

  insertStats(db, stats, buildId) {
    const newStats = stats.map(stat => {
      return {
        build_id: buildId,
        title: stat.title,
        stat_value: stat.stat_value
      }
    })
    return db
      .insert(newStats)
      .into('stats')
      .returning('*')
      .then(([stats]) => stats)
      .then(stats =>
        BuildsService.getStatsForBuild(db, buildId)
      )
  },

  insertPerks(db, perks, buildId) {
    if(!perks) {
      return null
    }
    const newPerks = perks.map(perk => {
      return {
        title: perk.title,
        build_id: buildId,
        stat_title: perk.stat_title,
        stat_rank: perk.stat_rank,
        perk_rank: perk.perk_rank,
        perk_description: perk.perk_description
      }
    })
    return db
      .insert(newPerks)
      .into('perks')
      .returning('*')
      .then(([perks]) => perks)
      .then(perks =>
        BuildsService.getPerksForBuild(db, buildId)
      )
  }
}

module.exports = BuildsService
