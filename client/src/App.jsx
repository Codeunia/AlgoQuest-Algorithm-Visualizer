import React, { useState } from 'react';

// Main App component that will contain our authentication forms
function App() {
  // State to toggle between 'login' and 'register' views
  const [isRegisterView, setIsRegisterView] = useState(true);

  return (
    // Main container for the authentication section
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isRegisterView ? 'Register for AlgoQuest' : 'Login to AlgoQuest'}
        </h2>

        {/* Toggle buttons for switching between forms */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setIsRegisterView(true)}
            className={`px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300
              ${isRegisterView ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Register
          </button>
          <button
            onClick={() => setIsRegisterView(false)}
            className={`px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300
              ${!isRegisterView ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Login
          </button>
        </div>

        {/* Render the appropriate form based on the state */}
        {isRegisterView ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
}

// RegisterForm Component
function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // For success messages
  const [error, setError] = useState('');     // For error messages

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setMessage('');     // Clear previous messages
    setError('');       // Clear previous errors

    try {
      // Make a POST request to your backend's register endpoint
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the server we're sending JSON
        },
        // Convert our form data into a JSON string
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json(); // Parse the JSON response from the server

      if (response.ok) { // Check if the response status is 2xx (success)
        setMessage(data.message); // Display success message
        // Optionally, clear the form fields
        setUsername('');
        setEmail('');
        setPassword('');
        // For a real app, you might automatically log in or redirect after successful registration
      } else {
        // If response is not ok (e.g., 400, 500), display the error message from the server
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      // Catch any network errors (e.g., server not running)
      console.error('Network error during registration:', err);
      setError('Could not connect to the server. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display messages */}
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{message}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}

      <div>
        <label htmlFor="registerUsername" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
        <input
          type="text"
          id="registerUsername"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="registerEmail" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          id="registerEmail"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="registerPassword" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input
          type="password"
          id="registerPassword"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
      >
        Register
      </button>
    </form>
  );
}

// LoginForm Component
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // For success messages
  const [error, setError] = useState('');     // For error messages

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setMessage('');     // Clear previous messages
    setError('');       // Clear previous errors

    try {
      // Make a POST request to your backend's login endpoint
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the server we're sending JSON
        },
        // Convert our form data into a JSON string
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Parse the JSON response from the server

      if (response.ok) { // Check if the response status is 2xx (success)
        setMessage(data.message); // Display success message
        console.log('Login successful! Token:', data.token);
        // 🔑 Store the JWT token in localStorage for future authenticated requests
        localStorage.setItem('token', data.token);
        // Optionally, store user info too
        localStorage.setItem('user', JSON.stringify(data.user));

        // For a real app, you would typically redirect the user to a dashboard or protected page
        // window.location.href = '/dashboard'; // Example redirection
      } else {
        // If response is not ok, display the error message from the server
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      // Catch any network errors
      console.error('Network error during login:', err);
      setError('Could not connect to the server. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display messages */}
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{message}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}

      <div>
        <label htmlFor="loginEmail" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          id="loginEmail"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="loginPassword" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input
          type="password"
          id="loginPassword"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
      >
        Login
      </button>
    </form>
  );
}

export default App;
