var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let crypto = require('crypto');
let expressSession = require('express-session');
let fileUpload = require('express-fileupload');
const { MongoClient } = require('mongodb');


var indexRouter = require('./routes/index');
const userSessionRouter = require('./routes/userSessionRouter');
const userAudiosRouter = require('./routes/userAudiosRouter');
const userAuthorRouter = require('./routes/userAuthorRouter');


var app = express();
const connectionStrings = 'mongodb+srv://admin:sdi@musicstoreapp.9du5exm.mongodb.net/?appName=musicstoreapp';
const dbClient = new MongoClient(connectionStrings);
let songsRepository = require("./repositories/songsRepository.js");
const usersRepository = require("./repositories/usersRepository.js");
const favoriteSongsRepository = require("./repositories/favoriteSongsRepository.js");
songsRepository.init(app, dbClient);
usersRepository.init(app, dbClient);
favoriteSongsRepository.init(app, dbClient);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressSession({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true
}));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  createParentPath: true
}));
app.use(cookieParser());

app.use("/songs/add", userSessionRouter);
app.use("/publications", userSessionRouter);
app.use("/audios/", userAudiosRouter);
app.use("/shop/", userSessionRouter);
app.use("/songs/favorites", userSessionRouter);
app.use("/songs/edit", userAuthorRouter);
app.use("/songs/delete", userAuthorRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.set('connectionStrings', connectionStrings);
app.set('uploadPath', __dirname);
app.set('clave', 'abcdefg');
app.set('crypto', crypto);

require("./routes/songs/favorites.js")(app, songsRepository, favoriteSongsRepository);
require("./routes/songs.js")(app, songsRepository);
require("./routes/authors.js")(app);
require("./routes/users.js")(app, usersRepository);

app.use('/', indexRouter);

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
