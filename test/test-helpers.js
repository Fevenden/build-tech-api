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
      user_id: users[2].id,
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
      id: 1,
      build_id: builds[0].id,
      title: 'strength',
      stat_value: 1
    },
    {
      id: 2,
      build_id: builds[0].id,
      title: 'perception',
      stat_value: 1
    },
    {
      id: 3,
      build_id: builds[0].id,
      title: 'endurance',
      stat_value: 1
    },
    {
      id: 4,
      build_id: builds[0].id,
      title: 'charisma',
      stat_value: 1
    },
    {
      id: 5,
      build_id: builds[0].id,
      title: 'intelligence',
      stat_value: 1
    },
    {
      id: 6,
      build_id: builds[0].id,
      title: 'agility',
      stat_value: 1,
    },
    {
      id: 7,
      build_id: builds[0].id,
      title: 'luck',
      stat_value: 1
    },
    {
      id: 8,
      build_id: builds[1].id,
      title: 'strength',
      stat_value: 1
    },
    {
      id: 9,
      build_id: builds[1].id,
      title: 'perception',
      stat_value: 1
    },
    {
      id: 10,
      build_id: builds[1].id,
      title: 'endurance',
      stat_value: 1
    },
    {
      id: 11,
      build_id: builds[1].id,
      title: 'charisma',
      stat_value: 1
    },
    {
      id: 12,
      build_id: builds[1].id,
      title: 'intelligence',
      stat_value: 1
    },
    {
      id: 13,
      build_id: builds[1].id,
      title: 'agility',
      stat_value: 1,
    },
    { 
      id: 14,
      build_id: builds[1].id,
      title: 'luck',
      stat_value: 1
    },
    {
      id: 15,
      build_id: builds[2].id,
      title: 'strength',
      stat_value: 1
    },
    {
      id: 16,
      build_id: builds[2].id,
      title: 'perception',
      stat_value: 1
    },
    {
      id: 17,
      build_id: builds[2].id,
      title: 'endurance',
      stat_value: 1
    },
    {
      id: 18,
      build_id: builds[2].id,
      title: 'charisma',
      stat_value: 1
    },
    {
      id: 19,
      build_id: builds[2].id,
      title: 'intelligence',
      stat_value: 1
    },
    {
      id: 20,
      build_id: builds[2].id,
      title: 'agility',
      stat_value: 1,
    },
    {
      id: 21,
      build_id: builds[2].id,
      title: 'luck',
      stat_value: 1
    }
  ]
}

function makePerksArray(builds) {
  return [
    {
      id: 1,
      title: 'Iron Fist',
      build_id: builds[0].id,
      stat_title: 'strength',
      stat_rank: 1,
      perk_rank: 1,
      perk_description: 'Channel your chi to unleash devastating fury! Punching attacks now do 20% more damage.'
    },
    {
      id: 2,
      title: 'Pickpocket',
      build_id: builds[0].id,
      stat_title: 'strength',
      stat_rank: 1,
      perk_rank: 2,
      perk_description: 'Picking pockets is now 50% easier. You can place a live grenade in a persons inventory.'
    },
    {
      id: 3,
      title: 'Iron Fist',
      build_id: builds[1].id,
      stat_title: 'strength',
      stat_rank: 1,
      perk_rank: 2,
      perk_description: 'Punching attacks now do 40% more damage and can disarm your opponent.'
    },
    {
      id: 4,
      title: 'Ricochet',
      build_id: builds[1].id,
      stat_title: 'luck',
      stat_rank: 10,
      perk_rank: 1,
      perk_description: 'What goes around comes around! Any enemys ranged attacks will sometimes ricochet back and instantly kill them. The closer you are to death, the higher the chance.'
    },
    {
      id: 5,
      title: 'Iron Fist',
      build_id: builds[2].id,
      stat_title: 'strength',
      stat_rank: 1,
      perk_rank: 2,
      perk_description: 'Punching attacks now do 40% more damage and can disarm your opponent.'
    },
    {
      id: 6,
      title: 'Ricochet',
      build_id: builds[2].id,
      stat_title: 'luck',
      stat_rank: 1,
      perk_rank: 1,
      perk_description: 'What goes around comes around! Any enemys ranged attacks will sometimes ricochet back and instantly kill them. The closer you are to death, the higher the chance.'
    },
  ]
}

function makeTestBuild(userId) {
  return {
    title: 'test build',
    user_id: userId,
    description: 'This is a test build that will be used to test the POST /api/builds endpoint',
    required_level: 32,
    stats: [
      {
        title: 'strength',
        stat_value: 1,
        perks: [
          {
            title: 'Iron Fist',
            stat_title: 'strength',
            stat_rank: 1,
            perk_rank: 1,
            perk_description: 'Channel your chi to unleash devastating fury! Punching attacks now do 20% more damage.'
          }
        ]
      },
      {
        title: 'perception',
        stat_value: 1,
        perks: []
      },
      {
        title: 'endurance',
        stat_value: 1,
        perks: []
      },
      {
        title: 'charisma',
        stat_value: 1,
        perks: []
      },
      {
        title: 'intelligence',
        stat_value: 1,
        perks: []
      },
      {
        title: 'agility',
        stat_value: 1,
        perks: []
      },
      {
        title: 'luck',
        stat_value: 1,
        perks: [
          {
            title: 'Ricochet',
            stat_title: 'luck',
            stat_rank: 10,
            perk_rank: 1,
            perk_description: 'What goes around comes around! Any enemys ranged attacks will sometimes ricochet back and instantly kill them. The closer you are to death, the higher the chance.'
          }
        ]
      }
    ]
  }
}

function makeExpectedBuild(users, build, stats=[], perks=[]) {
  const user = users.find(user => user.id === build.user_id)

  const buildStats = stats.filter(stat => stat.build_id === build.id)

  const buildPerks = perks.filter(perk => perk.build_id === build.id)

  const mappedStats = buildStats.map(stat => {
    return {
      ...stat,
      perks: buildPerks.filter(perk => perk.stat_title === stat.title)
    }
  })

  return {
    id: build.id,
    required_level: build.required_level,
    title: build.title,
    description: build.description,
    user_id: user.id,
    stats: mappedStats
  }
}

function makeExpectedPostBuild(build, resBody) {
  const mappedBuild = build.map(b => {
    return {
      ...b,
      id: resBody.build.id,
      stats: b.stats.map(s => {
        return {
          ...s,
          id: resBody.stats.find(st => st.title === s.title).id,
          build_id: resBody.build.id,
          perks: s.perks.map(p => {
            return {
              ...p,
              build_id: resBody.build.id,
              id: resBody.perks.filter(pe => 
                pe.stat_title === p.stat_title).find(pr => pr.title === p.title).id
            }
          })
        }
      })
    }
  })

  return mappedBuild[0]
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
    user_password: bcrypt.hashSync(user.user_password, 12)
  }))
  return db.into('users').insert(bcryptedUsers)
    .then(() => 
      db.raw( 
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id]
      )
    )
}

function seedBuildsTables(db, users, builds, stats=[], perks=[]) {
  return seedUsers(db, users)
    .then(() => {
      return db
        .into('builds')
        .insert(builds)
        .then(() => 
          db.raw(
            `SELECT setval('builds_id_seq', ?)`,
            [builds[builds.length - 1].id]
          )
        )
    })
    .then(() => 
      stats.length && db.into('stats').insert(stats),
    )
    .then(() => 
      perks.length && db.into('perks').insert(perks)
    )
}

function makeMaliciousData(user) {
  const maliciousData = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    user_id: user.id,
    required_level: 1
  }
  
  const expectedData = {
    ...makeExpectedBuild([user], maliciousData),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  }

  return {
    maliciousData,
    expectedData
  }
}

function seedMaliciousData(db, user, data) {
  return seedUsers(db, [user])
    .then(() => 
      db
        .into('builds')
        .insert([data])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ id: user.id}, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      perks,
      stats,
      users,
      builds 
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
  seedUsers,
  seedBuildsTables,
  makeExpectedBuild,
  makeMaliciousData,
  seedMaliciousData,
  makeAuthHeader,
  makeTestBuild,
  makeExpectedPostBuild
}