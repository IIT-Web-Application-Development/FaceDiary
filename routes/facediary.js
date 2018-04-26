var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Diary = require('../models/diary');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* Login form */
router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

/* Get all diary entries */
router.get('/', function(req, res, next) {
  Diary.find(function (err, facediary) {
    if (err) return console.error(err);
    res.json(facediary);
  })
});

/* Create diary entry */
router.post('/', function(req, res, next) {
  let diaryToCreate = new Diary(req.body);
  diaryToCreate.save(function(err, diary){
    res.send(diary);
  });
});

/* Get specific diary entry */
router.get('/:id', function(req, res, next) {
  Diary.findOne({_id: req.params["id"]}, function(err, diary) {
    if (err) return next(err);
    res.send(diary);
  });
});

/* Update specific diary entry */
router.put('/:id', function(req, res, next) {
  Diary.findOneAndUpdate({_id: req.params["id"]}, req.body, function(err, diary) {
    if (err) return next(err);
    res.status(204).send();
  });
});

/* Delete specific diary entry */
router.delete('/:id', function(req, res, next) {
  Diary.deleteOne({_id: req.params["id"]}, function(err, diary) {
    if (err) return next(err);
    res.status(204).send();
  });
});

module.exports = router;
