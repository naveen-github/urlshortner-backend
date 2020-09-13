const express = require('express')
const router = express.Router();
const UrlgeneratorController = require('./../controllers/urlgenerator.controller')


router.post("/create-short-url", UrlgeneratorController.createShortUrl);
router.get("/stats", UrlgeneratorController.getStats);
module.exports = router;