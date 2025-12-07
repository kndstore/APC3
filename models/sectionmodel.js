<<<<<<< HEAD

const mongoose = require('mongoose');



=======

const mongoose = require('mongoose');
>>>>>>> 02b1afd0d98877df3dc0f0ca9c45feab5667d737
const sectionSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  chef: { type: String, required: true },
  localisation: { type: String, required: true },
  
});

module.exports = mongoose.model('Section', sectionSchema);
