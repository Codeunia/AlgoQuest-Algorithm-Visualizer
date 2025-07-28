import React, { useState, useEffect } from 'react';

function AdminPanel() {
  const [problemForm, setProblemForm] = useState({
    _id: null,
    title: '',
    description: '',
    difficulty: 'Easy',
    category: '',
    tags: '',
    starterCode: '// Write your code here',
    solution: '',
    testCases: '[{"input":"1","expectedOutput":"1"}]'
  });

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const getToken = () => localStorage.getItem('token');

  const fetchProblems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/problems');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProblems(data.problems);
    } catch (err) {
      console.error("Error fetching problems for admin:", err);
      setError("Failed to load problems for admin panel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblemForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    let testCasesParsed;
    try {
      testCasesParsed = JSON.parse(problemForm.testCases);
    } catch {
      setError("Invalid JSON in test cases.");
      return;
    }

    const payload = {
      ...problemForm,
      tags: problemForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      testCases: testCasesParsed
    };

    const method = problemForm._id ? 'PUT' : 'POST';
    const url = problemForm._id
      ? `http://localhost:5000/api/problems/${problemForm._id}`
      : 'http://localhost:5000/api/problems';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setProblemForm({
          _id: null,
          title: '',
          description: '',
          difficulty: 'Easy',
          category: '',
          tags: '',
          starterCode: '// Write your code here',
          solution: '',
          testCases: '[{"input":"1","expectedOutput":"1"}]'
        });
        fetchProblems();
      } else {
        setError(data.message || `${method === 'POST' ? 'Adding' : 'Updating'} problem failed.`);
      }
    } catch (err) {
      console.error(`Error ${method === 'POST' ? 'adding' : 'updating'} problem:`, err);
      setError('Could not connect to the server or process request.');
    }
  };

  const handleEdit = (problem) => {
    setProblemForm({
      _id: problem._id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      category: problem.category,
      tags: problem.tags.join(', '),
      starterCode: problem.starterCode,
      solution: problem.solution,
      testCases: JSON.stringify(problem.testCases, null, 2)
    });
    setMessage(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) {
      return;
    }
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/problems/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        fetchProblems();
      } else {
        setError(data.message || 'Deleting problem failed.');
      }
    } catch (err) {
      console.error('Error deleting problem:', err);
      setError('Could not connect to the server or process request.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading admin problems...</div>;
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gray-800 text-center">Admin Panel: Manage Problems</h3>

      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h4 className="text-xl font-semibold text-indigo-700 mb-4">{problemForm._id ? 'Edit Problem' : 'Add New Problem'}</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input type="text" id="title" name="title" value={problemForm.title} onChange={handleChange} required
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea id="description" name="description" value={problemForm.description} onChange={handleChange} required rows="4"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="difficulty" className="block text-gray-700 text-sm font-bold mb-2">Difficulty</label>
              <select id="difficulty" name="difficulty" value={problemForm.difficulty} onChange={handleChange} required
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <input type="text" id="category" name="category" value={problemForm.category} onChange={handleChange} required
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">Tags (comma-separated)</label>
            <input type="text" id="tags" name="tags" value={problemForm.tags} onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
              placeholder="e.g., array, hashmap, sorting" />
          </div>
          <div>
            <label htmlFor="starterCode" className="block text-gray-700 text-sm font-bold mb-2">Starter Code</label>
            <textarea id="starterCode" name="starterCode" value={problemForm.starterCode} onChange={handleChange} rows="6"
              className="font-mono shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"></textarea>
          </div>
          <div>
            <label htmlFor="solution" className="block text-gray-700 text-sm font-bold mb-2">Solution Code (Optional)</label>
            <textarea id="solution" name="solution" value={problemForm.solution} onChange={handleChange} rows="6"
              className="font-mono shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"></textarea>
          </div>
          <div>
            <label htmlFor="testCases" className="block text-gray-700 text-sm font-bold mb-2">Test Cases (JSON Array of Objects)</label>
            <textarea id="testCases" name="testCases" value={problemForm.testCases} onChange={handleChange} required rows="6"
              className="font-mono shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
              placeholder='[{"input":"[1,2]","expectedOutput":"3"},{"input":"[3,4]","expectedOutput":"7"}]'></textarea>
            <p className="text-xs text-gray-500 mt-1">Example: `[{"input":"[2,7],9","expectedOutput":"[0,1]"}]`</p>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            {problemForm._id ? 'Update Problem' : 'Add Problem'}
          </button>
          {problemForm._id && (
            <button
              type="button"
              onClick={() =>
                setProblemForm({
                  _id: null,
                  title: '',
                  description: '',
                  difficulty: 'Easy',
                  category: '',
                  tags: '',
                  starterCode: '// Write your code here',
                  solution: '',
                  testCases: '[{"input":"1","expectedOutput":"1"}]'
                })
              }
              className="w-full mt-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
            >
              Clear Form
            </button>
          )}
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">Existing Problems</h4>
        {problems.length === 0 ? (
          <p className="text-center text-gray-600">No problems added yet.</p>
        ) : (
          <div className="space-y-4">
            {problems.map((problem) => (
              <div key={problem._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h5 className="text-lg font-semibold text-indigo-700">{problem.title}</h5>
                  <p className="text-gray-600 text-sm">Difficulty: {problem.difficulty} | Category: {problem.category}</p>
                </div>
                <div className="flex space-x-2 mt-3 sm:mt-0">
                  <button
                    onClick={() => handleEdit(problem)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(problem._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
import React, { useState, useEffect } from 'react';