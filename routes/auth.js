const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

router.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const newUser = new User({ email, password, role });
        await newUser.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            throw new Error('Credenciais inválidas');
        }

        res.status(200).json({ message: 'Login realizado com sucesso' });
    } catch (error) {
        res.status(401).json({ message: 'Falha no login', error: error.message });
    }
});

module.exports = router;
