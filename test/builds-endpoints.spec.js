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

  describe('GET /api/builds/:build_id', () => {
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
          .expect(200, expectedBuild)
      })
    })
    
    context('given XSS attack data', () => {
      const buildId = 911
      const testUser = testUsers[1]
      const {
        maliciousData,
        expectedData, 
      } = helpers.makeMaliciousData(testUser)

      beforeEach('insert malicious data', () => 
        helpers.seedMaliciousData(
          db,
          testUser,
          maliciousData
        )
      )

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/builds/${buildId}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedData.title)
            expect(res.body.description).to.eql(expectedData.description)
          })
      })    
    })
  })

  describe('POST /api/builds', () => {
    beforeEach('insert users', () => 
      helpers.seedUsers(db, testUsers)
    )

    it(`creates a build then responds with 201 and new build`, () => {
      const testUser = testUsers[1]
      const testBuild = helpers.makeTestBuild(testUser.id)
      
      return supertest(app)
        .post('/api/builds')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(testBuild)
        .expect(201)
        .expect(res => {
          const {build, stats, perks} = res.body
          expect(build).to.have.property('id')
          expect(build.title).to.eql(testBuild.title)
          expect(build.required_level).to.eql(testBuild.required_level)
          expect(build.description).to.eql(testBuild.description)
          expect(build.user_id).to.eql(testBuild.user_id)
          expect(stats.length).to.eql(7)
          expect(stats[0]).to.have.property('id')
          expect(stats[0]).to.have.property('build_id')
          expect(stats[0].build_id).to.eql(build.id)
          expect(stats[0].title).to.eql(testBuild.stats[0].title)
          expect(stats[0].stat_value).to.eql(testBuild.stats[0].stat_value)
          const statIndex = testBuild.stats.findIndex(stat => stat.title === perks[0].stat_title)
          expect(perks[0]).to.have.property('id')
          expect(perks[0]).to.have.property('build_id')
          expect(perks[0].build_id).to.eql(build.id)
          expect(perks[0].title).to.eql(testBuild.stats[statIndex].perks[0].title)
          expect(perks[0].stat_title).to.eql(testBuild.stats[statIndex].perks[0].stat_title)
          expect(perks[0].stat_rank).to.eql(testBuild.stats[statIndex].perks[0].stat_rank)
          expect(perks[0].perk_rank).to.eql(testBuild.stats[statIndex].perks[0].perk_rank)
          expect(perks[0].perk_description).to.eql(testBuild.stats[statIndex].perks[0].perk_description)
        })
        // make sure data was submitted properly by making get request for new build
        .then(res => {
          const expectedBuild = helpers.makeExpectedPostBuild([testBuild], res.body)
          return supertest(app)
            .get(`/api/builds/${res.body.build.id}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .expect(200, expectedBuild)
        })
    })
  })

  describe.only('DELETE /api/builds/:build_id', () => {
    context(`given no builds`, () => {
      beforeEach(() => 
        helpers.seedUsers(db, testUsers)
      )

      it(`responds with 404`, () => {
        const id = 123456
        return supertest(app)
          .delete(`/api/builds/${id}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
          .expect(404, { error: `Build doesn't exist`})
      })
    })

    context(`given user has builds`, () => {
      beforeEach(() => 
        helpers.seedBuildsTables(
          db,
          testUsers,
          testBuilds,
          testStats,
          testPerks
        )
      )

      it('responds with 204 and removes the build from database', () => {
        const testUser = testUsers[0]
        const buildId = 3
        const expected = testBuilds.filter(build => build.id !== buildId && build.user_id === testUser.id)
        return supertest(app)
          .delete(`/api/builds/${buildId}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(204)
            .then(res => 
              supertest(app)
                .get(`/api/builds`)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(expected)
            )
      })
    })
  })
})