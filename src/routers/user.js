const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')

// CREATE Endpoints
router.post("/users", async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({
      user,
      token
    })
  } catch (err) {
    res.status(400).send(err)
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({
      user,
      token
    })
  } catch (err) {
    res.status(400).send(err)
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send('User logged out')
  } catch (err) {
    res.status(500).send(err)
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.token = []
    await req.user.save()
    res.send('User logged out of all devices')
  } catch (err) {
    res.status(500).send(err)
  }
})

// READ Endpoints
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user)
})

// UPDATE Endpoints
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
  if (!isValidUpdate) {
    return res.status(400).send('Invalid Update')
  }
  try {
    const user = req.user
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

const upload = multer({
  dest: 'avatars',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image in JPEG or PNG'))
    }
    cb(undefined, true)
  }
})

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({
    error: error.message
  })
})


// DELETE Endpoints
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (err) {
    res.status(500).send(err)
  }
})


module.exports = router