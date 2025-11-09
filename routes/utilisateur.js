const express = require("express");
const router = express.Router();
const User = require("../models/usermodel");

// ✅ Afficher la page des utilisateurs
router.get("/", async (req, res) => {
  const { nom, role } = req.query;
  const users = await User.find();
  res.render("utilisateur", { users, nom, role });
});

// ✅ Ajouter un utilisateur
router.post("/add", async (req, res) => {
  try {
    const { mle, nom, role, username, password } = req.body;
    if (!mle || !nom || !role || !username || !password) {
      return res.status(400).json({ ok: false, message: "Champs manquants" });
    }

    const exists = await User.findOne({ username });
    if (exists) return res.json({ ok: false, message: "Nom d’utilisateur déjà utilisé" });

    await User.create({ mle, nom, role, username, password });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
});

// ✅ Modifier un utilisateur
router.post("/edit/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

// ✅ Supprimer un utilisateur
router.delete("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

module.exports = router;
