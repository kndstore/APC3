const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');

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

  // ✅ Ici on redirige vers /materiel.ejs  avec les infos dans l'URL
  res.redirect(`/materiel?nom=${user.nom}&role=${user.role}`);
});

// Pour créer un utilisateur test
router.get('/create', async (req, res) => {
  await User.create({
    mle: '003',
    nom: 'Admin3',
    role: 'Administrateur',
    username: 'admin3',
    password: '12345'
  });
  res.send(`Utilisateur admin créé `);
});

module.exports = router;
