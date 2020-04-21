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
    context.only('Happy path', () => {
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
          // .expect(res => {
          //   expect(res.body).to.have.property('id')
          //   expect(res.body.username).to.eql(newUser.username)
          //   expect(res.body.full_name).to.eql(newUser.full_name)
          //   expect(res.body.email).to.eql(newUser.email)
          //   expect(res.body).to.not.have.property('user_password')
          //   expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
          //   const expectedDate = new Date().toLocaleString()
          //   const actualDate = new Data(res.body.date_created).toLocaleString()
          //   expect(actualDate).to.eql(expectedDate)
          // })
          // .expect(res => 
          //   db
          //   .from('users')
          //   .select('*')
          //   .where({ id: res.body.id})
          //   .first()
          //   .then(row => {
          //     expect(row.username).to.eql(newUser.username)
          //     expect(row.full_name).to.eql(newUser.full_name)
          //     const expectedDate = new Date().toLocaleString()
          //     const actualDate = new Date(row.date_created).toLocaleString()
          //     expect(actualDate).to.eql(expectedDate)
              
          //     return bcrpyt.compare(newUser.password, res.password)
          //   })
          //   .then(match => {
          //     expect(match).to.be.true
          //   })
          // )
      })
    })
  })
}) 