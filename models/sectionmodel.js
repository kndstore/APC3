
const mongoose = require('mongoose');



const sectionSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  chef: { type: String, required: true },
  localisation: { type: String, required: true },
  
});

module.exports = mongoose.model('Section', sectionSchema);
