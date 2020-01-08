const Auth = require('../lib/auth');
const ItemModel = require('../models/item-model');
const Router = require('express').Router;
const router = Router();

router.get('/add-item', Auth.authorizeUserAsAdmin, function(req, res) {
  return res.render('admin/add-item', {
    title: 'Add a new item for sale'
  });
});

router.post('/add-item', Auth.authorizeUserAsAdmin, function(req, res) {
  const itemName = req.body.itemName;
  const itemPrice = req.body.itemPrice;
  const currencyCode = req.body.currencyCode;

  const newItem = new ItemModel({
    name: itemName,
    price: itemPrice,
    currencyCode
  });

  newItem.save()
    .then(() => {
      res.redirect('/admin/add-item');
    })
    .catch(err => {
      console.log(err.stack);
      res.send('Could not save item');
    });
});

module.exports = router;