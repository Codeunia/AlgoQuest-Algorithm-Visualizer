import React from 'react';

const ProblemList = ({ onSelectProblem }) => {
  const problems = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      tags: ['Array', 'Hashmap', 'Two Pointers'],
      description:
        'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target...'
    },
    {
      id: 2,
      title: 'Bubble Sort',
      difficulty: 'Easy',
      tags: ['Array', 'Sorting'],
      description:
        'Implement the bubble sort algorithm to sort an array of integers in ascending order...'
    },
    {
      id: 3,
      title: 'Quick Sort',
      difficulty: 'Medium',
      tags: ['Array', 'Sorting', 'Divide and Conquer'],
      description:
        'Implement the Quick Sort algorithm to sort an array of integers using a divide and conquer approach...'
    }
  ];

  return (
    <div className="space-y-4">
      {/* ---------- Contest Announcement ---------- */}
      <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
        <div className="flex items-center mb-2 text-sm text-gray-500">
          <span className="font-semibold text-indigo-600">AlgoQuest</span>
          <span className="ml-2">posted</span>
          <span className="ml-auto text-gray-400">7 days ago</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🏆 Weekly Contest 1 Announced!
        </h3>
        <p className="text-gray-600">
          Join our very first AlgoQuest Weekly Contest and test your problem-solving
          skills against others! Prizes for the top 3 contestants.
        </p>
        <div className="mt-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Join Contest
          </button>
        </div>
      </div>

      {/* ---------- Problems Feed ---------- */}
      {problems.map((problem) => (
        <div
          key={problem.id}
          onClick={() => onSelectProblem(problem.id)}
          className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center mb-2 text-sm text-gray-500">
            <span className="font-semibold text-indigo-600">AlgoQuest Bot</span>
            <span className="ml-2">posted a new problem</span>
            <span className="ml-auto text-gray-400">2h ago</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600">
            {problem.title}
          </h3>
          <p className="text-gray-600 mt-1">{problem.description}</p>
          <div className="flex flex-wrap items-center mt-3 text-xs text-gray-500 space-x-2">
            <span
              className={`px-2 py-1 rounded-full ${
                problem.difficulty === 'Easy'
                  ? 'bg-green-100 text-green-800'
                  : problem.difficulty === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {problem.difficulty}
            </span>
            {problem.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProblemList;
