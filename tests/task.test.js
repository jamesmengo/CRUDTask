const app = require('../src/app')
const Task = require('../src/models/task')
const request = require('supertest')
const {
  userOneId,
  userOne,
  userTwo,
  userTwoId,
  setUpDatabase,
  taskOne,
  taskTwo,
  taskThree
} = require('./fixtures/db')

beforeEach(setUpDatabase);

test('Should create a user task', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my test'
    })
    .expect(201)

  const task = await Task.findById(response.body._id)
  expect(task).not.toBeNull
  expect(task.completed).toBe(false)
})

test('Should fetch 2 tasks for userOne', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
  expect(response.body.length).toBe(2)
})

test('Should not delete other users tasks', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

  const task = await Task.findById(taskOne._id)
  expect(task).not.toBeNull()
})