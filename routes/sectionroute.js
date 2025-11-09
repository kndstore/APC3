const express = require('express');
const router = express.Router();
const Section = require('../models/sectionmodel');

// 🧾 Afficher la liste des sections
router.get('/', async (req, res) => {
  const { nom, role } = req.query; // récupère depuis l’URL ex: /section?nom=Admin&role=Chef

  try {
    const sections = await Section.find();
    res.render('section', { sections, nom, role }); // 👈 On envoie bien les données
  } catch (err) {
    console.error('Erreur lors du chargement des sections :', err);
    res.render('section', { sections: [], nom, role });
  }
});

// ➕ Ajouter une section
router.post('/add', async (req, res) => {
  const { nom, chef, localisation, userNom, userRole } = req.body; // 👈 userNom/Role viennent du formulaire caché
  await Section.create({ nom, chef, localisation });
  res.redirect(`/section?nom=${userNom}&role=${userRole}`); // 👈 Retour avec infos utilisateur
});

// 💾 Modifier une section
router.post('/edit/:id', async (req, res) => {
  const { userNom, userRole } = req.body;
  await Section.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/section?nom=${userNom}&role=${userRole}`);
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
