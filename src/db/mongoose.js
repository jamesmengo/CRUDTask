const mongoose = require("mongoose");

mongoose.connect(
  'mongodb+srv://James:admin@cluster0-wnava.mongodb.net/Tasks?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
);