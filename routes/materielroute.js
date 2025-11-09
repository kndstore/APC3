const express = require('express');
const router = express.Router();
const Materiel = require('../models/materielmodel');
const Stock = require('../models/stock');   // <-- ajouter ceci pour le modèle Stock
// ✅ Afficher la liste du matériel
router.get('/', async (req, res) => {
  const { nom, role } = req.query;
  const materiels = await Materiel.find().sort({ date_entree: -1 });
  res.render('materiel', { materiels, nom, role });
});

// ➕ Ajouter un matériel
router.post('/', async (req, res) => {
  try {
    const { designation, qte, ns, position, section, date_entree } = req.body;

    // Chercher la désignation dans le stock
    const stockItem = await Stock.findOne({ designation });
    if (!stockItem) {
      return res.status(400).send('❌ Désignation non trouvée dans le stock');
    }

    // Vérifier que la quantité demandée est disponible
   // Vérifier que la quantité demandée est disponible
if (Number(qte) > stockItem.qte) {
  return res.status(400).send('Stock insuffisant !'); // message envoyé au front
}

    // Créer le matériel
    const materiel = new Materiel({
      designation,
      qte,
      ns,
      position,
      section,
      date_entree
    });
    await materiel.save();

    // Diminuer la quantité dans le stock
    stockItem.qte -= Number(qte);
    await stockItem.save();

    res.status(200).send('✅ Matériel ajouté et stock mis à jour !');
  } catch (err) {
    console.error(err);
    res.status(500).send('⚠️ Erreur serveur');
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updatedMateriel = await Materiel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // renvoie l'objet mis à jour + validation
    );
    
    if (!updatedMateriel) return res.status(404).send({ message: "Matériel non trouvé" });
    
    res.send(updatedMateriel);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: "Erreur lors de la mise à jour", error: err });
  }
});


// 🗑 Supprimer un matériel
router.delete('/:id', async (req, res) => {
  try {
    const materiel = await Materiel.findById(req.params.id);
    if (!materiel) return res.status(404).send('❌ Matériel introuvable');

    // Ajouter la quantité supprimée au stock
    const stockItem = await Stock.findOne({ designation: materiel.designation });
    if (stockItem) {
      stockItem.qte += materiel.qte;
      await stockItem.save();
    }

    await Materiel.findByIdAndDelete(req.params.id);
    res.status(200).send('🗑 Matériel supprimé et stock mis à jour !');
  } catch (err) {
    console.error(err);
    res.status(500).send('⚠️ Erreur serveur');
  }
});


module.exports = router;
