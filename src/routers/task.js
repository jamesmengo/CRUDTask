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

// GET /tasks?completed={bool}
// GET /tasks?limit={size}&skip={size*page}
// GET /tasks?sortBy={field}_{asc/desc}
router.get("/tasks", auth, async (req, res) => {
  const match = {}
  const sort = {}
  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split('_')
    const field = sort[parts[0]]
    const ascending = parts[1] === 'asc' ? 1 : -1
    sort[field] = ascending
  }
  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      },
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