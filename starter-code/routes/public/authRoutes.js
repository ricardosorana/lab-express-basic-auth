const express = require('express');
const bcrypt = require('bcrypt');
const Users = require('../../models/User');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('public/signup');
});

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    let hashPassword;

    if (password) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      hashPassword = bcrypt.hashSync(password, salt);
    }

    const newUser = new Users({ username, password: hashPassword });
    await newUser.save();

    res.redirect('/auth/login');
  } catch (error) {
    console.log(error);

    if (error.message.includes('required')) {
      res.render('public/signup', { errorMessage: 'Por favor, preencha todos os campos' });
      return;
    }

    if (error.message.includes('username')) {
      res.render('public/signup', { errorMessage: 'Usuário já cadastrado. Por favor escolha outro nome de usuário.' });
      return;
    }
  }
});

router.get('/login', (req, res) => {
  console.log(req.session);
  res.render('public/login');
});

router.post('/login', async(req, res) => {
  try {
    const { username, password } = req.body;

    if(!username || !password) {
      res.render('public/login', { errorMessage: 'Por favor, preencha todos os campos' })
      return;
    }

    const user = await Users.findOne({ username });

    if(!user) {
      res.render('public/login', { errorMessage: 'Usuário ou senha incorretos' });
      return;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if(!isPasswordValid) {
      res.render('public/login', { errorMessage: 'Usuário ou senha incorretos' });
      return;
    }

    req.session.loggedUser = user;
    res.redirect('/main');
  } catch(error) {
    throw new Error(error);
  }
});



module.exports = router;