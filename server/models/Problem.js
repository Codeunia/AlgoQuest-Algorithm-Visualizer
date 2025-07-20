const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Problem title is required'],
        unique: true,
        trim: true,
        minlength: [5, 'Problem title must be at least 5 characters long']
    },
    description: {
        type: String,
        required: [true, 'Problem description is required'],
        minlength: [20, 'Problem description must be at least 20 characters long']
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: [true, 'Difficulty is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    starterCode: {
        type: String,
        default: '// Write your code here'
    },
    solution: {
        type: String,
        required: false
    },
    testCases: [{
        input: {
            type: String,
            required: true
        },
        expectedOutput: {
            type: String,
            required: true
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
