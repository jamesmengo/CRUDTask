const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
  _id: userOneId,
  name: "Kevin",
  email: "Kevin@test.com",
  password: "Kevin123",
  tokens: [{
    token: jwt.sign({
      _id: userOneId
    }, process.env.JWT_SECRET)
  }]
};

const userTwoId = new mongoose.Types.ObjectId()

const userTwo = {
  _id: userTwoId,
  name: "James",
  email: "James@test.com",
  password: "James@!123",
  tokens: [{
    token: jwt.sign({
      _id: userTwoId
    }, process.env.JWT_SECRET)
  }]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  creator: userOneId
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: true,
  creator: userOneId
}

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  completed: false,
  creator: userTwoId
}

const setUpDatabase = async () => {
  await User.deleteMany({});
  await Task.deleteMany({})
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
}

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  setUpDatabase,
  taskOne,
  taskTwo,
  taskThree
}