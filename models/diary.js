var mongoose = require('mongoose');

var DiarySchema = mongoose.Schema({
  userid: String,
  timestamp: String,
  picture: String,
  emotion: String,
  comment: String
});

// Add virtual field 'id' which equals '_id'.
DiarySchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
DiarySchema.set('toObject', {
  virtuals: true
});

// Remove underscore prefix fields from output
DiarySchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
}

module.exports = mongoose.model('diary', DiarySchema);