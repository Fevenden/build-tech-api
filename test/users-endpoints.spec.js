const knex = require('knex')
const bcrpyt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function() {
  let db

  const { testUsers } = helpers.makeBuildsFixtures()
  const testUser = testUsers[0]

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

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )

      const requiredFields = ['username', 'user_password', 'full_name', 'email']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          username: 'test username',
          user_password: 'test password',
          full_name: 'test full_name',
          email: 'testemail@email.com',
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })

        it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
          const userShortPassword = {
            username: 'test user_name',
            user_password: '1234567',
            full_name: 'test full_name',
            email: 'testemail@email.com'
          }
          return supertest(app)
            .post('/api/users')
            .send(userShortPassword)
            .expect(400, {error: `Password must be at least 8 characters`})
        })

        it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
          const userLongPassword = {
            username: 'test user_name',
            user_password: '*'.repeat(73),
            full_name: 'test full_name',
            email: 'testemail@email.com'
          }
         
          return supertest(app)
            .post('/api/users')
            .send(userLongPassword)
            .expect(400, { error: `Password must be less than 72 characters`})
        })

        it(`responds with 400 error when password starts with spaces`, () => {
          const userPasswordStartsSpaces = {
            username: 'test user_name',
            user_password: ' 1Aa!2b@',
            full_name: 'test full_name',
            email: 'testemail@email.com'
          }
          return supertest(app)
            .post('/api/users')
            .send(userPasswordStartsSpaces)
            .expect(400, {error: `Password must not start or end with empty spaces`})
        })

        it(`responds with 400 error when password ends with spaces`, () => {
          const userPasswordStartsSpaces = {
            username: 'test user_name',
            user_password: '1Aa!2b@ ',
            full_name: 'test full_name',
            email: 'testemail@email.com'
          }
          return supertest(app)
            .post('/api/users')
            .send(userPasswordStartsSpaces)
            .expect(400, {error: `Password must not start or end with empty spaces`})
        })

        it(`responds with 400 error when password isn't complex enough`, () => {
          const userPasswordNotComplex = {
            username: 'test user_name',
            user_password: '11AAaabb',
            full_name: 'test full_name',
            email: 'testemail@email.com'
          }
          return supertest(app)
            .post('/api/users')
            .send(userPasswordNotComplex)
            .expect(400, { error: `Password must contain 1 upper case, lower case, number, and special character`})
        })

        it(`respnds 400 'User name already taken' when user_name isn't unique`, () => {
          const duplicateUser = {
            username: testUser.username,
            user_password: '11AAaa!!',
            full_name: 'test full_name',
            email: 'testemail@email.com'
          }
          return supertest(app)
            .post('/api/users')
            .send(duplicateUser)
            .expect(400, { error: `Username already taken` })
        })
      })
    })

    context('Happy path', () => {
      it(`responds 201, serialized user, storing bcrypted password`, () => {
        const newUser = {
          username: 'test-username',
          user_password: '11AAaa!!',
          full_name: 'Full Name',
          email: 'testemail@email.com'
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.username).to.eql(newUser.username)
            expect(res.body.full_name).to.eql(newUser.full_name)
            expect(res.body.email).to.eql(newUser.email)
            expect(res.body).to.not.have.property('user_password')
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
            const expectedDate = new Date().toLocaleString()
            const actualDate = new Date(res.body.date_created).toLocaleString()
            expect(actualDate).to.eql(expectedDate)
          })
          .expect(res => 
            db
            .from('users')
            .select('*')
            .where({ id: res.body.id})
            .first()
            .then(row => {
              expect(row.username).to.eql(newUser.username)
              expect(row.full_name).to.eql(newUser.full_name)
              const expectedDate = new Date().toLocaleString()
              const actualDate = new Date(row.date_created).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
              
              return bcrpyt.compare(newUser.password, res.password)
            })
            .then(match => {
              expect(match).to.be.true
            })
          )
      })
    })
  })
}) 