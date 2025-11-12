const express = require('express');
const router = express.Router();
const Materiel = require('../models/materielmodel');
const Historique = require('../models/historiquemodel');
var NOMO='';
const Stock = require('../models/stock');   // <-- ajouter ceci pour le modèle Stock


// ✅ Afficher la liste du matériel
router.get('/', async (req, res) => {
  const { nom, role } = req.query;
  NOMO=nom;
  const materiels = await Materiel.find().sort({ date_entree: -1 });
  res.render('materiel', { materiels, nom, role });
});

// ➕ Ajouter un matériel
router.post('/', async (req, res) => {
  try {
    const { designation, qte, ns, position, section, date_entree } = req.body;
    

    // 🔹 1. Chercher la désignation dans le stock
    const stockItem = await Stock.findOne({ designation });
    if (!stockItem) {
      return res.status(400).send('❌ Désignation non trouvée dans le stock');
    }

    // 🔹 2. Vérifier la quantité disponible
    if (Number(qte) > stockItem.qte) {
      return res.status(400).send('Stock insuffisant !');
    }

    // 🔹 3. Créer le matériel
    const materiel = new Materiel({
      designation,
      qte,
      ns,
      position,
      section,
      date_entree
    });
    await materiel.save();

    // 🔹 4. Diminuer la quantité dans le stock
    stockItem.qte -= Number(qte);
    await stockItem.save();

    // 🔹 5. Ajouter un enregistrement dans l'historique
    const historique = new Historique({
      designation,
      qte,
      section,
      operation: 'Ajout', // ou 'Ajout' selon ton contexte
      date_operation: new Date(),
      details: `Matériel sorti vers la section ${section}`,
      operateur:NOMO
    });
    await historique.save();

    // 🔹 6. Réponse au client
    res.status(200).send('✅ Matériel ajouté, stock mis à jour et historique enregistré !');

  } catch (err) {
    console.error(err);
    res.status(500).send('⚠️ Erreur serveur');
  }
});



// ✅ Route de mise à jour (UPDATE)
router.put('/:id', async (req, res) => {
      const { nom } = req.body; // 👈 récupère le nom envoyé du client
console.log(NOMO);

  try {
    const updatedMateriel = await Materiel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMateriel)
      return res.status(404).send({ message: "Matériel non trouvé" });

    const { designation, qte, section, date_entree } = updatedMateriel;

    const historique = new Historique({
      designation,
      qte,
      section,
      operation: 'Modification',
      details: `Modification du matériel ${designation} (quantité : ${qte}, section : ${section}, date entrée : ${date_entree ? new Date(date_entree).toLocaleDateString() : '—'})`,
      operateur: NOMO || 'Inconnu'
    });

    await historique.save();

    res.status(200).send({
      message: "✅ Matériel mis à jour et historique enregistré",
      materiel: updatedMateriel,
    });
  } catch (err) {
    console.error("❌ Erreur complète :", err);
    res.status(500).send({ message: "Erreur lors de la mise à jour", error: err.message });
  }
});





// 🗑 Supprimer un matériel
router.delete('/:id', async (req, res) => {
  try {
    const materiel = await Materiel.findById(req.params.id);
    

    if (!materiel) return res.status(404).send('❌ Matériel introuvable');

    const stockItem = await Stock.findOne({ designation: materiel.designation });
    if (stockItem) {
      stockItem.qte += materiel.qte;
      await stockItem.save();
    }

    await Materiel.findByIdAndDelete(req.params.id);

    const historique = new Historique({
      designation: materiel.designation,
      qte: materiel.qte,
      section: materiel.section,
      operation: 'Suppression',
      details: `Matériel supprimé de la section ${materiel.section}`,
      operateur: NOMO || 'Inconnu'
    });

    await historique.save();

    res.status(200).send('✅ Matériel supprimé et historique enregistré');
  } catch (err) {
    console.error("❌ Erreur complète :", err);
    res.status(500).send({ message: "Erreur lors de la suppression", error: err.message });
  }
});





module.exports = router;
