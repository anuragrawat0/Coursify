const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const purchaseSchema = new Schema({
  userID : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  courseID : {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }, 
  
},{ timestamps: true })

module.exports = mongoose.model('Purchase', purchaseSchema);