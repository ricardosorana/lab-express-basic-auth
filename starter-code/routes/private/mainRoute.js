const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    const { loggedUser } = req.session;

    res.render('private/main');
})


module.exports = router;