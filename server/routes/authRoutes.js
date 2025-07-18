const express = require('express');
const router = express.Router();

const User = require('../models/User');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: '1h',
    });
};

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        user = new User({
            username,
            email,
            password
        });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token,
        });

    } catch (error) {
        console.error(error.message);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(', ') });
        }
        res.status(500).json({ message: 'Server error during registration' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;
