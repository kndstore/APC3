const express = require('express');
const router = express.Router();
const Stock = require('../models/stock');

// ✅ Afficher tout le stock
router.get('/', async (req, res) => {
  try {
    const materiels = await Stock.find();
    const { nom, role } = req.query;
    res.render('stock', { materiels, nom, role });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// ✅ Ajouter un matériel
router.post('/add', async (req, res) => {
  try {
    await Stock.create(req.body);
    res.status(201).send('Ajouté');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de l’ajout');
  }
});

// ✅ Modifier un matériel
router.post('/edit/:id', async (req, res) => {
  try {
    await Stock.findByIdAndUpdate(req.params.id, req.body);
    res.send('Mis à jour');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur de modification');
  }
});

// ✅ Supprimer un matériel
router.delete('/delete/:id', async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.send('Supprimé');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur de suppression');
  }
});
// 🔹 Route pour récupérer toutes les désignations sans doublon
router.get('/designations', async (req, res) => {
  try {
    const designations = await Stock.distinct('designation'); // supprime les doublons
    res.json(designations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/check', async (req, res) => {
  try {
    const { designation } = req.query;
    if (!designation) return res.status(400).json({ error: "Désignation manquante" });

    const exists = await Stock.exists({ designation: { $regex: `^${designation}$`, $options: 'i' } });
    res.json({ exists: !!exists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
