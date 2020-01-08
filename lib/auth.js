function authorizeUser(req, res, next) {
  if(req.session.loggedin !== true) {
    return res.redirect('/signin');
  }
  next();
}

function authorizeUserAsAdmin(req, res, next) {
  if(req.session.loggedin !== true) {
    return res.redirect('/signin');
  }

  if(req.session.user.type !== 'admin') {
    return res.redirect('/');
  }

  next();
}

module.exports = {
  authorizeUser,
  authorizeUserAsAdmin
};
