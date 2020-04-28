const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const userOne = {
  name: "Kevin",
  email: "Kevin@test.com",
  password: "Kevin123",
};

beforeEach(async () => {
  await User.deleteMany({});
  await new User(userOne).save();
});

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "James",
      email: "jamesmeng@test.com",
      password: "mypass123",
    })
    .expect(201);
});

test('Should login existing user', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)
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