const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('protected endpoints', () => {
  let db

  const {
    testUsers,
    testBuilds,
    testStats,
    testPerks
  } = helpers.makeBuildsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  beforeEach('insert articles', () => 
    helpers.seedBuildsTables(
      db,
      testUsers,
      testBuilds,
      testStats,
      testPerks
    )
  )

  const protectedEndpoints = [
    {
      name: 'GET /api/builds',
      path: '/api/builds',
      method: supertest(app).get
    }
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds with 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` })
      })

      it(`responds with 401 'Unauthorized request', when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, {error: `Unauthorized request`})
      })

      it(`responds 401 'Unauthorized request' when invalid user sub in payload`, () => {
        const invalidUser = { username: 'notExist', id:1 }
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, {error: `Unauthorized request`})
      })
    })
  }) 
})