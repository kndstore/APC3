const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const Nombre = require('../models/nbrmodel');

// Delete first document POST route
router.post('/delete-first', async (req, res) => {
  try {
    const result = await Nombre.deleteOne({}, { sort: { _id: 1 } });
    
    if (result.deletedCount === 0) {
      return res.json({ success: false, message: 'Nombre connectes: 0' });
    }
    
res.redirect(`/`);  } 
catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// Route pour la page de connexion
router.get('/', (req, res) => {
  res.render('login', { message: null });
});

// Traitement du formulaire de connexion recuperer username et password depuis form
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
//comparer username form et username base de donnees
  const user = await User.findOne({ username, password });
  
  if (!user) {
    return res.render('login', { message: 'Nom d’utilisateur ou mot de passe incorrect' });
  }
   await Nombre.create({nombre:1});
// In materiel route

  
  // ✅ Ici on redirige vers /materiel.ejs  avec les infos dans l'URL
  res.redirect(`/materiel?nom=${user.nom}&role=${user.role}`);
});



module.exports = router;
