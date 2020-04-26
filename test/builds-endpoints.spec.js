const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Build Endpoints', function() {
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
      beforeEach(() => 
        helpers.seedUsers(db, testUsers)
      )

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/builds')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
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
        const expectedBuilds = testBuilds.filter(build => build.user_id === testUsers[1].id)
          .map(build => 
            helpers.makeExpectedBuild(
              testUsers,
              build,
              testStats,
              testPerks,
            )
          )
        return supertest(app)
          .get('/api/builds')
          .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
          .expect(200, expectedBuilds)
      })
    })

    context(`Given an XSS attack`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousData,
        expectedData, 
      } = helpers.makeMaliciousData(testUser)

      beforeEach(`insert malicious data`, () => 
        helpers.seedMaliciousData(
          db,
          testUser,
          maliciousData
        )
      )

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/builds`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedData.title)
            expect(res.body[0].description).to.eql(expectedData.description)
          })
      })        
    })
  })

  describe.only('GET /api/builds/:build_id', () => {
    context(`Given no builds`, () => {
      beforeEach('insert test user', () => 
        helpers.seedUsers(db, testUsers)
      )

      it(`responds with 404`, () => {
        const buildId = 123456
        return supertest(app)
          .get(`/api/builds/${buildId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
          .expect(404, { error: `Build doesn't exist` })
      })
    })
    
    context(`Given build exists`, () => {
      beforeEach('insert data', () => 
        helpers.seedBuildsTables(
          db,
          testUsers,
          testBuilds,
          testStats,
          testPerks
        )
      )

      it('responds with 200 and the expected build', () => {
        const buildId = 2
        const testUser = testUsers.filter(user => user.id === testBuilds[buildId - 1].user_id)[0]
        const expectedBuild = helpers.makeExpectedBuild(
          testUsers,
          testBuilds[buildId - 1],
          testStats,
          testPerks
        )

        return supertest(app)
          .get(`/api/builds/${buildId}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .then(console.log)
          // .expect(200, expectedBuild)
      })
    })
  })
})