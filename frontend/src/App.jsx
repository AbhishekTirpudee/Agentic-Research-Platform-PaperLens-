import { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(''); setResult('');

    if (!query.trim()) return setError('Query cannot be empty.');

    try {
      const response = await fetch('http://localhost:5000/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
      <h2>PaperLens: Secure Agentic Platform</h2>
      <form onSubmit={handleSearch}>
        <input 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Topic (e.g., Quantum Cryptography)" 
          style={{ width: '70%', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Analyze</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <div style={{ marginTop: '20px', padding: '15px', background: '#eee' }}>{result}</div>}
    </div>
  );
}

export default App;