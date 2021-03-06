const express = require('express');
const bp = require('body-parser');
const router = express.Router();

router.use(bp.urlencoded({extended: true}));

router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;