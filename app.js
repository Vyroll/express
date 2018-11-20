const createError = require('http-errors');
const express = require('express'); 
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

//instant msg
  // session
  app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }))

  // global access
  app.use(flash());
  app.use(function(req, res, next){
    res.locals.messages = req.flash();
    next();
  });

//database connection
  mongoose.connect('mongodb://localhost/db_cont', { useNewUrlParser: true });
  let db = mongoose.connection;
  //database check connection
  db.once('open', ()=>{
    console.log('[kg] Connected to DB');
  });
  ()=>console.log('awd');
  
  db.on('error', (err)=>{
    console.log('[kg] ' + err);
  })
  // import models
  let Article = require('./models/article')

//routing
  const indexRouter = require('./routes/index');
  const articlesRouter = require('./routes/articles');

// view engine setup
  // app.set('view options', { layout: 'other' });
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

//other
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/articles', articlesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

hbs.registerHelper('empt', function(obj){
  let empty = true;
  Object.entries(obj).forEach(([key, value]) => {
    if (value.length > 0) {
      empty = false;
    }
  });
  return empty;
})

module.exports = app;
