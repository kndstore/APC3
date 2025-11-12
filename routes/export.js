const express = require('express');
const router = express.Router();
const Historique = require('../models/historiquemodel');
const ExcelJS = require('exceljs');

// 📥 Exporter l'historique en Excel
router.get('/', async (req, res) => {
  try {
    const historiques = await Historique.find().sort({ date_operation: -1 });

    // Créer un nouveau classeur Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Historique');

    // Colonnes
    worksheet.columns = [
      { header: '#', key: 'index', width: 5 },
      { header: 'Désignation', key: 'designation', width: 30 },
      { header: 'Quantité', key: 'qte', width: 10 },
      { header: 'Section', key: 'section', width: 20 },
      { header: 'Opération', key: 'operation', width: 15 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Détails', key: 'details', width: 40 }
    ];

    // Ajouter les lignes
    historiques.forEach((item, index) => {
      worksheet.addRow({
        index: index + 1,
        designation: item.designation,
        qte: item.qte,
        section: item.section || '-',
        operation: item.operation,
        date: item.date_operation.toLocaleString('fr-FR'),
        details: item.details || '-'
      });
    });

    // Style header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF343A40' }, // fond gris foncé
      };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true }; // texte blanc
    });

    // Envoyer le fichier Excel
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Historique.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('❌ Erreur export Excel:', err);
    res.status(500).send('Erreur serveur lors de l’export Excel');
  }
});

module.exports = router;
