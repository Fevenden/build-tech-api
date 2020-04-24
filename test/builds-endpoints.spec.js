const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Build Endpoints', function() {
  let db

  const {
    testUsers,
    testBuilds,
    testStats,
    testPerks,
  } = helpers.makeBuildsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/builds`, () => {
    context('Given no builds', () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/builds')
          // .then(console.log)
          .expect(200, [])
      })
    })

    context(`Given user has builds`, () => {
      beforeEach('insert data', () => 
        helpers.seedBuildsTables(
          db,
          testUsers,
          testBuilds,
          testStats,
          testPerks,
        )
      )

      it(`responds with 200 and all the users builds`, () => {
        const expectedBuilds = testBuilds.map(build => 
          helpers.makeExpectedBuild(
            testUsers,
            build,
            testStats,
            testPerks,
          )
        )
        return supertest(app)
          .get('/api/builds')
          // .expect(200, expectedBuilds)
          .then(console.log)
      })
    })
  })
})