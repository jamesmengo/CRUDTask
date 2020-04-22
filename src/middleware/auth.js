const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, 'taskApp')
    const user = await User.findOne({
      _id: decoded._id, //find user
      'tokens.token': token //verify that token is still stored
    })
    if (!user) throw new Error()
    req.user = user
    req.token = token
    next()
  } catch (err) {
    res.status(401).send({
      error: 'Please Authenticate'
    })
  }
}

module.exports = auth