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
        'build.user_id',
        ...statFields,
        ...perkFields,
      )
      .rightJoin(
        'stats AS stats',
        'build.id',
        'stats.build_id'
      )
      .rightJoin(
        'perks AS perk',
        'build.id',
        'perk.id'
      )
  },

  getById(db, id) {
    return buildsService.getAllThings(db)
      .where('user.id', id)
      .first()
  },

  getStatsForBuild(db) {
    return db 
      .from('stats AS stat')
      .select(
        'stat.id',
        'stat.build_id',
        'stat.title',
        'stat_value',
      )
      .where('stat.build_id', buildId)
  },

  getPerksForBuild(db, buildId) {
    return db 
      .from('perks AS perk')
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

  serializeBuild(build) {
    const BuildTree = new Treeize()

    const buildData = BuildTree.grow([build]).getData()[0]

    return {
      id: buildData.id,
      title: xss(buildData.title),
      description: xss(buildData.description),
      user_id: buildData.user_id,
      stats: buildData.stats || [],
      perks: buildData.perks || [],
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
      title: xss(perkData.title),
      stat_title: perkData.stat_title,
      stat_rank: perkData.stat_rank,
      perk_rank: perkData.perk_rank,
      perk_description: xss(perkData.perk_description),
    }
  },

  serializePerks(perks) {
    return perks.map(this.serializePerk)
  },
  
  
}

const statFields = [
  'stats.id AS stats:stat:id',
  'stats.build_id AS stats:stat:build_id',
  'stats.title AS stats:stat:title',
  'stats.stat_value AS stats:stat:stat_value',  
//   'perks.id AS stats:perks:id',
//   'perks.title AS stats:perks:id',
//   'perks.build_id AS stats:perks:build_id',
//   'perks.stat_title AS stats:perks:stat_title',
//   'perks.stat_rank AS stats:perks:stat_rank',
//   'perks.perk_rank AS stats:perks:perk_rank',
//   'perks.perk_description AS stats:perks:perk_description'
]

const perkFields = [
  'perk.id AS perk:id',
  'perk.title AS perk:title',
  'perk.build_id AS perk:build_id',
  'perk.stat_title AS perk:stat_title',
  'perk.stat_rank AS perk:stat_rank',
  'perk.perk_rank AS perk:perk_rank',
  'perk.perk_description AS perk:perk_description'
]

module.exports = BuildsService