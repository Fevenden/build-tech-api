const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      full_name: 'Test user 1',
      user_password: 'password',
      email: 'testemail1@email.com',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 2,
      username: 'test-user-2',
      full_name: 'Test user 2',
      user_password: 'password',
      email: 'testemail2@email.com',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 3,
      username: 'test-user-3',
      full_name: 'Test user 3',
      user_password: 'password',
      email: 'testemail3@email.com',
      date_created: '2029-01-22T16:28:32.615Z'
    }
  ]
}

function makeBuildsArray(users) {
  return [
    {
      id: 1,
      user_id: users[1].id,
      title: 'Test Build 1',
      description: 'This is a description of test build 1',
      required_level: 1
    },
    {
      id: 2,
      user_id:users[2].id,
      title: 'Test Build 2',
      description: 'This is a description of test build 2',
      required_level: 40
    },
    {
      id: 3,
      user_id: users[0].id,
      title: 'Test Build 3',
      description: 'This is a description of test build 3',
      required_level: 100
    }
  ]
}

function makeStatsArray(builds) {
  return [
    {
      build_id: builds[0].id,
      title: 'strength',
      value: 1
    },
    {
      build_id: builds[0].id,
      title: 'perception',
      value: 1
    },
    {
      build_id: builds[0].id,
      title: 'endurance',
      value: 1
    },
    {
      build_id: builds[0].id,
      title: 'charisma',
      value: 1
    },
    {
      build_id: builds[0].id,
      title: 'intelligence',
      value: 1
    },
    {
      build_id: builds[0].id,
      title: 'agility',
      value: 1,
    },
    {
      build_id: builds[0].id,
      title: 'luck',
      value: 1
    },
    {
      build_id: builds[1].id,
      title: 'strength',
      value: 1
    },
    {
      build_id: builds[1].id,
      title: 'perception',
      value: 1
    },
    {
      build_id: builds[1].id,
      title: 'endurance',
      value: 1
    },
    {
      build_id: builds[1].id,
      title: 'charisma',
      value: 1
    },
    {
      build_id: builds[1].id,
      title: 'intelligence',
      value: 1
    },
    {
      build_id: builds[1].id,
      title: 'agility',
      value: 1,
    },
    {
      build_id: builds[1].id,
      title: 'luck',
      value: 1
    },
    {
      build_id: builds[2].id,
      title: 'strength',
      value: 1
    },
    {
      build_id: builds[2].id,
      title: 'perception',
      value: 1
    },
    {
      build_id: builds[2].id,
      title: 'endurance',
      value: 1
    },
    {
      build_id: builds[2].id,
      title: 'charisma',
      value: 1
    },
    {
      build_id: builds[2].id,
      title: 'intelligence',
      value: 1
    },
    {
      build_id: builds[2].id,
      title: 'agility',
      value: 1,
    },
    {
      build_id: builds[2].id,
      title: 'luck',
      value: 1
    }
  ]
}

function makePerksArray(builds) {
  [
    {
      title: 'Iron Fist',
      build_id: builds[0].id,
      stat_title: 'strength',
      stat_rank: '1',
      perk_rank: '1',
      perk_description: 'Channel your chi to unleash devastating fury! Punching attacks now do 20% more damage.'
    },
    {
      title: 'Iron Fist',
      build_id: builds[1].id,
      stat_title: 'strength',
      stat_rank: '1',
      perk_rank: '2',
      perk_description: 'Punching attacks now do 40% more damage and can disarm your opponent.'
    },
    {
      title: 'Ricochet',
      build_id: builds[2].id,
      stat_title: 'luck',
      stat_rank: '10',
      perk_rank: '1',
      perk_description: 'What goes around comes around! Any enemys ranged attacks will sometimes ricochet back and instantly kill them. The closer you are to death, the higher the chance.'
    }
  ]
}

function makeBuildsFixtures() {
  const testUsers = makeUsersArray()
  const testBuilds = makeBuildsArray(testUsers)
  const testStats = makeStatsArray(testBuilds)
  const testPerks = makePerksArray(testBuilds)
  return {testUsers, testBuilds, testStats, testPerks}
}

function seedUsers(db, users) {
  const bcryptedUsers = users.map(user => ({
    ...user,
    user_password: bcrypt.hashSync(user.user_password, 1)
  }))
  return db.into('users').insert(bcryptedUsers)
    .then(() => 
      db.raw( 
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id]
      )
    )
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      perks,
      stats,
      builds,
      users
      RESTART IDENTITY CASCADE
    `
  )
}

module.exports = {
  makeBuildsArray,
  makePerksArray,
  makeStatsArray,
  makeUsersArray,
  makeBuildsFixtures,
  cleanTables,
  seedUsers
}