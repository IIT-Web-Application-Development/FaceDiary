var express = require('express');
var path = require('path'); 
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var sortJsonArray = require('sort-json-array');
let Diary = require('./models/diary');
mongoose.connect('mongodb://localhost/test');
// password functionality
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var db = require('./db');
var cookieParser = require("cookie-parser");
var session = require("express-session");

var facediary = require('./routes/facediary');

var app = express();
app.disable('etag');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use('/api/facediary', facediary);

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      console.log(username)
      console.log(password)
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
}));
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});
passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Get login
app.get('/login', function (req, res) {
  res.render('loginForm', { title: "New Login",diary: {} });
});

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    res.redirect("/");
});

// Get all diary entries
app.get('/', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
  Diary.find(function (err, facediary) {
    if (err) return console.error(err);
    sortJsonArray(facediary, 'timestamp', 'des');
    console.log(facediary);
    res.render('index', { facediary: facediary, user: req.user });
  })
});

// Create diary entry
app.get('/facediary/new', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var CurrentDateTime = date+'-'+time;
  res.render('diaryForm', { title: CurrentDateTime, user: req.user, diary: {} });
});

app.post('/facediary/new', require('connect-ensure-login').ensureLoggedIn(), function(req, res, next) {
  let diaryToCreate = new Diary(req.body);
  diaryToCreate.save(function(err, diary){
    res.redirect("/");
  });
});

// Update specific diary entry
app.get('/facediary/:id/update', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
  let id = req.params["id"]
  Diary.findOne({_id: id}, function(err, diary) {
    res.render('diaryForm', { title: diary.timestamp, user: req.user, diary: diary });
  });
});

app.post('/facediary/:id/update', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
  let id = req.params["id"]
  Diary.findOneAndUpdate({_id: id}, req.body, function(err, diary) {
    if (err) return next(err);
    res.redirect('/facediary/' + id);
  });
});

// Delete specific diary entry
app.post('/facediary/:id/delete', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
  let id = req.params["id"]
  Diary.deleteOne({_id: id}, function(err, diary) {
    res.redirect("/");
  });
});

// Get specific diary entry
app.get('/facediary/:id', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
  Diary.findOne({_id: req.params["id"]}, function(err, diary) {
    if (err) return next(err);
    res.render('diary', { diary: diary });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
