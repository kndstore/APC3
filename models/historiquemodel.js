const mongoose = require('mongoose');

const historiqueSchema = new mongoose.Schema({
  designation: { type: String, required: true },
  qte: { type: Number, required: true },
  section: { type: String },
  operation: { type: String, required: true }, // 'Entrée', 'Sortie', 'Modification', 'Suppression'
  date_operation: { type: Date, default: Date.now },
  details: { type: String },
  operateur: { type: String, required: false } // 👈 ajouter ce champ obligatoire
});

module.exports = mongoose.model('Historique', historiqueSchema);
