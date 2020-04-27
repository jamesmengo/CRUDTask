const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

// Task Endpoints
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    creator: req.user._id
  })
  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

// GET /tasks?completed=true
router.get("/tasks", auth, async (req, res) => {
  // const match = {
  //   completed: req.query.completed === 'true' ? True : False
  // }
  const match = {}
  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
    console.log(match.completed)
  }
  try {
    await req.user.populate({
      path: 'tasks',
      match
    }).execPopulate()
    res.send(req.user.tasks)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOne({
      _id,
      creator: req.user._id
    })
    if (!task) {
      return res.status(404).send(`Could not locate task with id ${_id}`)
    }
    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
  if (!isValidUpdate) {
    return res.status(400).send('Invalid update')
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      creator: req.user._id
    })
    if (!task) {
      return res.status(404).send()
    }
    updates.forEach((key) => task[key] = req.body[key])
    await task.save()
    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      creator: req.user._id
    })
    if (!task) {
      return res.status(404).send('Could not find task')
    }
    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router