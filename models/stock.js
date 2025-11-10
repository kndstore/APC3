const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  designation: { type: String, required: true },
  qte:         { type: Number, required: true },
 
});

module.exports = mongoose.model('Stock', stockSchema);
