const Sequelize = require('sequelize');

const UrlsModel = require('./../models/url.model')
const UrlstatsModel = require('./../models/urlstats.model')
// Database Connection
const sequelize =  new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host:process.env.DB_HOST,
  dialect:process.env.DB_DIALECT,
  freezeTableName: true,
});

const Urls = UrlsModel(sequelize, Sequelize);
const Urlstats = UrlstatsModel(sequelize, Sequelize);

sequelize.authenticate()
  .then(() => {
    console.log(`Database connected using ${process.env.DB_HOST}`)
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  
  // Urls.sequelize.sync({ force: true }); // On First time for Table creation
  // Urls.sequelize.sync({alter: true}) // On for Alteration whenever doing alter in Database
  module.exports = {sequelize, Urls, Urlstats};