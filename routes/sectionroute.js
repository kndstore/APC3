const express = require('express');
const router = express.Router();
const Section = require('../models/sectionmodel');
var nom,role;
// 🧾 Afficher la liste des sections
router.get('/', async (req, res) => {
   { nom, role } = req.query; // récupère depuis l’URL ex: /section?nom=Admin&role=Chef

  try {
    const sections = await Section.find();
    res.render('section', { sections, nom, role }); // 👈 On envoie bien les données
  } catch (err) {
    console.error('Erreur lors du chargement des sections :', err);
    res.render('section', { sections: [], nom, role });
  }
});

// ➕ Ajouter une section ✅ CORRIGÉ
router.post('/add', async (req, res) => {
  try {
    const { nomS, chef, localisation } = req.body;

    await Section.create({ nomS, chef, localisation });

    // ✅ Redirection correcte après l'ajout
    res.redirect(`/section?nom=${nom}&role=${role}`);
  } catch (err) {
    console.error('❌ Erreur ajout section :', err);
    res.status(500).send('Erreur serveur');
  }
});

// 🔄 Mettre à jour une section
router.put('/update/:id', async (req, res) => {
  try {
    const { nom, chef, localisation } = req.body;
    const section = await Section.findByIdAndUpdate(
      req.params.id,
      { nom, chef, localisation },
      { new: true }
    );

    if (!section) return res.status(404).send('Section non trouvée');

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Erreur maj section :', err);
    res.status(500).send('Erreur serveur');
  }
});

// 🗑 Supprimer une section
router.delete('/delete/:id', async (req, res) => {
  await Section.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});


// 🔹 Route pour récupérer toutes les sections sans doublon
router.get('/noms', async (req, res) => {
  try {
    const sections = await Section.distinct('nom'); // 'nom' = le champ du modèle
    res.json(sections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
