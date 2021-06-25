const config = require('../config');
const mongoose = require('mongoose');

require('./models/portfolio');
require('./models/blog');

exports.connect = () => {
  return mongoose.connect(config.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(
      () => console.log('Connected to DB!'),
      err => console.error(err)
    );
}