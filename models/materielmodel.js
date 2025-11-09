const mongoose = require('mongoose');

const materielSchema = new mongoose.Schema({
  designation: { type: String, required: true },
  qte: { type: Number, required: true },
  ns: { type: String, required: true },
  position: { type: String, required: true },
  section: { type: String, required: true },
  date_entree: { type: Date, required: true }
});

module.exports = mongoose.model('Materiel', materielSchema);
