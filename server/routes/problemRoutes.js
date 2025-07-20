const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem'); // Import the Problem model

// Middleware to protect routes (we'll define this in a separate file soon)
// For now, it's commented out, but we'll add it for real protection later.
// const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route POST /api/problems
 * @desc Create a new coding problem
 * @access Private (will require authentication later)
 */
router.post('/', async (req, res) => {
    // Extract problem data from the request body
    const { title, description, difficulty, category, tags, starterCode, solution, testCases } = req.body;

    // Basic server-side validation
    if (!title || !description || !difficulty || !category || !testCases || testCases.length === 0) {
        return res.status(400).json({ message: 'Please provide all required problem fields and at least one test case.' });
    }

    try {
        // Check if a problem with the same title already exists
        const existingProblem = await Problem.findOne({ title });
        if (existingProblem) {
            return res.status(400).json({ message: 'A problem with this title already exists.' });
        }

        // Create a new Problem instance
        const newProblem = new Problem({
            title,
            description,
            difficulty,
            category,
            tags: tags || [], // Ensure tags is an array, even if not provided
            starterCode,
            solution,
            testCases,
            // createdBy: req.user.id // Uncomment and use this after implementing auth middleware
        });

        // Save the problem to the database
        const savedProblem = await newProblem.save();

        res.status(201).json({
            message: 'Problem created successfully',
            problem: savedProblem
        });

    } catch (error) {
        console.error('Error creating problem:', error.message);
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(', ') });
        }
        res.status(500).json({ message: 'Server error creating problem.' });
    }
});

/**
 * @route GET /api/problems
 * @desc Get all coding problems
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        // Find all problems in the database
        const problems = await Problem.find({}); // Empty object means find all documents

        res.status(200).json({
            message: 'Problems fetched successfully',
            count: problems.length,
            problems: problems
        });

    } catch (error) {
        console.error('Error fetching problems:', error.message);
        res.status(500).json({ message: 'Server error fetching problems.' });
    }
});

/**
 * @route GET /api/problems/:id
 * @desc Get a single coding problem by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
    try {
        // Find a problem by its ID
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found.' });
        }

        res.status(200).json({
            message: 'Problem fetched successfully',
            problem: problem
        });

    } catch (error) {
        console.error('Error fetching single problem:', error.message);
        // Handle invalid ID format specifically
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid problem ID format.' });
        }
        res.status(500).json({ message: 'Server error fetching problem.' });
    }
});

/**
 * @route PUT /api/problems/:id
 * @desc Update a coding problem by ID
 * @access Private (will require authentication later)
 */
router.put('/:id', async (req, res) => {
    const { title, description, difficulty, category, tags, starterCode, solution, testCases } = req.body;

    // Basic validation for update (can be more robust)
    if (!title && !description && !difficulty && !category && !tags && !starterCode && !solution && !testCases) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    try {
        const problemId = req.params.id;

        // Find the problem by ID and update it.
        // { new: true } returns the updated document.
        // { runValidators: true } ensures schema validators run on update.
        const updatedProblem = await Problem.findByIdAndUpdate(
            problemId,
            req.body, // Directly pass the request body for update
            { new: true, runValidators: true }
        );

        if (!updatedProblem) {
            return res.status(404).json({ message: 'Problem not found.' });
        }

        res.status(200).json({
            message: 'Problem updated successfully',
            problem: updatedProblem
        });

    } catch (error) {
        console.error('Error updating problem:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid problem ID format.' });
        }
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errors.join(', ') });
        }
        res.status(500).json({ message: 'Server error updating problem.' });
    }
});

/**
 * @route DELETE /api/problems/:id
 * @desc Delete a coding problem by ID
 * @access Private (will require authentication later)
 */
router.delete('/:id', async (req, res) => {
    try {
        const problemId = req.params.id;

        // Find the problem by ID and delete it
        const deletedProblem = await Problem.findByIdAndDelete(problemId);

        if (!deletedProblem) {
            return res.status(404).json({ message: 'Problem not found.' });
        }

        res.status(200).json({
            message: 'Problem deleted successfully',
            problem: deletedProblem
        });

    } catch (error) {
        console.error('Error deleting problem:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid problem ID format.' });
        }
        res.status(500).json({ message: 'Server error deleting problem.' });
    }
});

module.exports = router;
// This code defines the routes for managing coding problems in a coding platform.