// app.js
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/userroute');
const materielRoute = require('./routes/materielroute');
const sectionRoute = require('./routes/sectionroute');
const stockRoute = require('./routes/stock');
const historiqueRoute = require('./routes/historiqueroute');
const exportRoute = require('./routes/export');

require('dotenv').config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
// Servir les fichiers statiques
app.use(express.static('public'));
// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gestion_materiel_simple')
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.log('❌ Erreur MongoDB :', err));

// Routes
// ⚡ Import de la route utilisateurs


const utilisateurRoutes = require("./routes/utilisateur");
app.use("/utilisateurs", utilisateurRoutes);

app.use('/', userRoute);
app.use('/materiel', materielRoute);
app.use('/section', sectionRoute);
app.use('/stock', stockRoute);
app.use('/historique', historiqueRoute);
app.use('/export', exportRoute);


// Lancer serveur
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
