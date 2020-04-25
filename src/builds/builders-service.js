const Treeize = require('treeize')
const xss = require('xss')

const BuildsService = {
  getAllUsersBuilds(db) {
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
  },

  getById(db, id) {
    return buildsService.getAllThings(db)
      .where('user.id', id)
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

  getPerks(db) {
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
}

module.exports = BuildsService