const express = require('express');
const router = express.Router();
const Materiel = require('../models/materielmodel');
var NOMO='';


// ✅ Afficher la liste du matériel
router.get('/', async (req, res) => {
  const { nom, role } = req.query;
  NOMO=nom;
  const materiels = await Materiel.find().sort({ date_entree: -1 });
  
  res.render('validation', { materiels, nom, role});

});





// ✅ Route de mise à jour (UPDATE)
router.put('/:id', async (req, res) => {
      const { nom } = req.body; // 👈 récupère le nom envoyé du client
console.log(NOMO);
const validation='N'
  try {
    const updatedMateriel = await Materiel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMateriel)
      return res.status(404).send({ message: "Matériel non trouvé" });
    
    const { designation, qte, section, date_entree,validation } = updatedMateriel;

    res.status(200).send({
      message: "✅ Matériel mis à jour ",
      materiel: updatedMateriel,
    });
  } catch (err) {
    console.error("❌ Erreur complète :", err);
    res.status(500).send({ message: "Erreur lors de la mise à jour", error: err.message });
  }
});





module.exports = router;
