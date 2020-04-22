const express = require('express')
const router = new express.Router()
const User = require('../models/user')

// User Endpoints
router.post("/users", async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).send(user)
  } catch (err) {
    res.status(400).send(err)
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    res.send(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id
  try {
    const user = await User.findById(_id)
    if (!user) {
      return res.status(404).send(`Could not find user with id: ${_id}`)
    }
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
  if (!isValidUpdate) {
    return res.status(400).send('Invalid Update')
  }
  try {
    const user = await User.findById(req.params.id)
    updates.forEach((key) => user[key] = req.body[key])
    await user.save()
    if (!user) {
      return res.status(404).send('Could not locate a user with that ID')
    }
    res.send(user)
  } catch (err) {
    return res.status(500).send(err)
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).send('Could not find user')
    }
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})


module.exports = router