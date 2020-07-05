module.exports = app => {

  // Base URLS
  app.use('/', require('./index.routes'))
  app.use('/', require('./auth.routes'))
  app.use('/main', require('./main.routes'))
  app.use('/profile', require('./user.routes'))
  app.use('/profile/setedit', require('./editdeck.routes'))
}
