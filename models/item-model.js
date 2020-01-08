const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  currencyCode: String,
  picture: String
});

const ItemModel = mongoose.model('item', ItemSchema);

module.exports = ItemModel;
