const express = require('express');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user-model');
const ItemModel = require('../models/item-model');
const Auth = require('../lib/auth');
const router = express.Router();

/* GET home page. */
router.get('/', Auth.authorizeUser, async function(req, res) {
  const allItems = await ItemModel.find({});

  res.render('index', { 
    title: 'Inventory page', 
    allItems,
    cart: req.session.cart || []
  });
});

router.post('/add-to-cart', Auth.authorizeUser, function(req, res) {
  if(req.session.cart === undefined) {
    req.session.cart = [];
  }

  const itemId = req.body.itemId;
  req.session.cart.push(itemId);
  res.redirect('/');
});

router.get('/signout', function(req, res) {
  req.session.loggedin = false;
  req.session.user = null;
  res.redirect('/signin');
})

router.get('/signin', function(req, res) {
  res.render('signin', { title: 'Signin' });
});

router.post('/signin', async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await UserModel.findOne({ email: email });
  if(user === null) {
    return res.redirect('/signin');
  }

  const passHash = user.password;

  const passwordMatched = await bcrypt.compare(password, passHash);
  if(passwordMatched) {
    req.session.loggedin = true;
    req.session.user = user.toJSON();
    res.redirect('/');
  }
  else {
    res.redirect('/signin');
  }
});

router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Register for our service' });
});

router.post('/signup', async function(req, res) {
  const name = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;

  if(name === undefined || email === undefined || password === undefined) {
    res.send('Fill in all fields to continue');
  }

  const passwordHash = await bcrypt.hash(password, 8);

  const newUser = new UserModel({
    name: name,
    email: email,
    password: passwordHash,
    type: 'customer'
  });

  newUser.save()
    .then(() => {
      res.redirect('/signin');
    })
    .catch(err => {
      console.log(err.message);
      return res.redirect('/signup');
    });
});

module.exports = router;
