var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');
var usersRouter = require('./routes/users');
var promoRouter = require('./routes/promo');
var productsRouter = require('./routes/products');
var contactRouter = require('./routes/contact');
var adminRouter = require('./routes/administrator');
var tipsntrickRouter = require('./routes/tipsntrick');
var eventnnewsRouter = require('./routes/eventnnews');

var articleRouter = require('./routes/article');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/users', usersRouter);
app.use('/promo', promoRouter);
app.use('/products', productsRouter);
app.use('/contactus', contactRouter);
app.use('/administrator', adminRouter);
app.use('/tipsntrick', tipsntrickRouter);
app.use('/eventnnews', eventnnewsRouter);

app.use('/article', articleRouter);

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

module.exports = app;
