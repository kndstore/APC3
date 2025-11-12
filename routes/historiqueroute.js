const express = require('express');
const router = express.Router();
const Historique = require('../models/historiquemodel'); // Vérifie bien le chemin exact

// 📜 Route pour afficher tous les historiques
router.get('/', async (req, res) => {
  try {
    const historiques = await Historique.find().sort({ date_operation: -1 });
    const { nom, role } = req.query; // récupère les infos depuis l'URL (si présentes)
    res.render('afficher_historique', { historiques, nom, role });
  } catch (err) {
    console.error('❌ Erreur serveur :', err);
    res.status(500).send('Erreur serveur');
  }
});

// ➕ Route pour créer un nouvel historique
router.post('/', async (req, res) => {
  const { designation, qte, section, operation, date_operation, details,operateur } = req.body;

  try {
    const newHistorique = new Historique({
      designation,
      qte,
      section,
      operation,
      date_operation,
      details,
      operateur
    });

    await newHistorique.save();
    res.status(201).redirect('/historique'); // redirige vers la page d’historique
  } catch (err) {
    console.error('❌ Erreur lors de la création :', err);
    res.status(400).send('Erreur lors de la création de l’historique');
  }
});

// ✏️ Route pour modifier un historique
router.put('/:id', async (req, res) => {
  const { designation, qte, section, operation, date_operation, details,operateur } = req.body;

  try {
    const updatedHistorique = await Historique.findByIdAndUpdate(
      req.params.id,
      { designation, qte, section, operation, date_operation, details,operateur },
      { new: true, runValidators: true }
    );

    if (!updatedHistorique) {
      return res.status(404).send('Historique non trouvé');
    }

    res.status(200).json(updatedHistorique);
  } catch (err) {
    console.error('❌ Erreur de mise à jour :', err);
    res.status(400).send('Erreur lors de la mise à jour de l’historique');
  }
});
// 🗑️ Route pour supprimer un enregistrement de l'historique
router.delete('/:id', async (req, res) => {
  try {
    const historique = await Historique.findById(req.params.id);

    if (!historique) {
      return res.status(404).json({ message: '❌ Historique non trouvé' });
    }

    await Historique.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: `✅ Historique "${historique.designation}" supprimé avec succès.`,
    });
  } catch (err) {
    console.error('❌ Erreur lors de la suppression de l’historique :', err);
    res.status(500).json({ message: '⚠️ Erreur serveur lors de la suppression' });
  }
});


module.exports = router;
