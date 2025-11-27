const mongoose = require('mongoose');

const nbrSchema = new mongoose.Schema({
  
  nombre:{ type: Number, required: true },
 
});

module.exports = mongoose.model('nombre', nbrSchema);
