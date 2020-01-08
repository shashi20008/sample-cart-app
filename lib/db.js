'use strict';
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dbuser:test123@nov01-u1bu9.mongodb.net/test?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const connection = mongoose.connection;

connection.on('error', err => {
  console.log('An error occured while conecting!', err.message);
  throw err;
});

connection.on('open', () => {
  console.log('DB connection successful');
});
