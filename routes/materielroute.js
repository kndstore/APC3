const express = require('express');
const router = express.Router();
const Materiel = require('../models/materielmodel');
const Historique = require('../models/historiquemodel');
const Section = require('../models/sectionmodel');
var NOMO='';
const Stock = require('../models/stock');   // <-- ajouter ceci pour le modèle Stock


// ✅ Afficher la liste du matériel
router.get('/', async (req, res) => {
  const { nom, role } = req.query;
  NOMO=nom;
  const materiels = await Materiel.find().sort({ date_entree: -1 });
  const totalPannes = await Materiel.countDocuments({ position: "En panne" });
  const totalSection = await Section.countDocuments();
  const totalArticles = (await Materiel.distinct("designation")).length;

  res.render('materiel', { materiels, nom, role, totalPannes , totalSection,totalArticles});

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
const PDFDocument = require('pdfkit');
router.get('/export-pdf/:id', async (req, res) => {
  try {
    const materiel = await Materiel.findById(req.params.id);
    if (!materiel) return res.status(404).send('Matériel non trouvé');


    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=decharge_${materiel._id}.pdf`);

    doc.pipe(res);

    // ---------------------- EN-TETE ----------------------
    // Logo (optionnel, mettre le chemin correct)
    // doc.image('public/images/ZY.png', 50, 20, { width: 50 });
    
    // Nom de l’APC ou titre
    doc.fontSize(16).text('APC DE ZIGHOUD YOUCEF', { align: 'center' });
    doc.fontSize(14).text('Décharge de Matériel', { align: 'center' });
    doc.moveDown(2);

    // ---------------------- CONTENU ----------------------
    doc.fontSize(12);
    doc.text(`Désignation : ${materiel.designation}`);
    doc.text(`Quantité : ${materiel.qte}`);
    doc.text(`N° Série : ${materiel.ns}`);
    doc.text(`Position : ${materiel.position}`);
    doc.text(`Section : ${materiel.section}`);
    const dateEntree = materiel.date_entree ? materiel.date_entree.toISOString().split('T')[0] : 'N/A';
    doc.text(`Date d'entrée : ${dateEntree}`);
    doc.moveDown();
    doc.text('Je soussigné(e), le bénéficiaire,..................................................... reconnais avoir reçu le matériel mentionné ci-dessus.', { align: 'justify' });
    doc.moveDown(3);

    // ---------------------- SIGNATURE ----------------------
    doc.text('Signature du bénéficiaire : _________________________', { align: 'left' });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la génération du PDF');
  }
});



module.exports = router;
