import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', full_name: '', company_name: '', phone: '', role: 'importer'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8001/api/auth/register', form);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.detail || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Full Name</label>
              <input type="text" className="w-full px-4 py-3 border rounded-lg" 
                onChange={(e) => setForm({...form, full_name: e.target.value})} required />
            </div>
            <div>
              <label>Username</label>
              <input type="text" className="w-full px-4 py-3 border rounded-lg" 
                onChange={(e) => setForm({...form, username: e.target.value})} required />
            </div>
          </div>

          <div>
            <label>Email</label>
            <input type="email" className="w-full px-4 py-3 border rounded-lg" 
              onChange={(e) => setForm({...form, email: e.target.value})} required />
          </div>

          <div>
            <label>Company Name</label>
            <input type="text" className="w-full px-4 py-3 border rounded-lg" 
              onChange={(e) => setForm({...form, company_name: e.target.value})} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Phone</label>
              <input type="tel" className="w-full px-4 py-3 border rounded-lg" 
                onChange={(e) => setForm({...form, phone: e.target.value})} required />
            </div>
            <div>
              <label>Role</label>
              <select className="w-full px-4 py-3 border rounded-lg" 
                onChange={(e) => setForm({...form, role: e.target.value})}>
                <option value="importer">Importer</option>
                <option value="exporter">Exporter</option>
                <option value="broker">Broker</option>
              </select>
            </div>
          </div>

          <div>
            <label>Password</label>
            <input type="password" className="w-full px-4 py-3 border rounded-lg" 
              onChange={(e) => setForm({...form, password: e.target.value})} required />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold mt-4"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}