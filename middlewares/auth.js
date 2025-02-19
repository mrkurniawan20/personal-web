async function checkUser(req, res, next) {
  const user = await req.session.user;
  if (!user) {
    req.flash('error', 'You need to Sign In');
    return res.redirect('/login');
  }
  next();
}

module.exports = checkUser;
