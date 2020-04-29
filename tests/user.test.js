const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const {
  userOneId,
  userOne,
  setUpDatabase
} = require('./fixtures/db')

beforeEach(setUpDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "James",
      email: "jamesmeng@test.com",
      password: "mypass123",
    })
    .expect(201);

  // Assert that user was added to database
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // Assert about response body
  expect(response.body.user.name).toBe('James')

  expect(response.body).toMatchObject({
    user: {
      name: 'James',
      email: 'jamesmeng@test.com'
    },
    token: user.tokens[0].token
  })
  expect(user.password).not.toBe('MyPass777!')
});

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  const user = await User.findById(userOneId)
  expect(user).not.toBeNull()
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existing user', async () => {
  await request(app).post('/users/login').send({
    email: 'nonexistent@testemail.com',
    password: 'asdf123!'
  }).expect(400)
})

test('Should not login existing user with incorrect password', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: 'asdf123!'
  }).expect(400)
})

test('Should not login existing user with incorrect email', async () => {
  await request(app).post('/users/login').send({
    email: 'nonexistent@testemail.com',
    password: userOne.password
  }).expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete user account', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete unauthenticated user account', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update user name', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Test'
    })
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.name).toBe('Test')
})

test('Should not update invalid user field', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Test'
    })
    .expect(400)
})