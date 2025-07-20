const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express(); // App startup

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);


app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
