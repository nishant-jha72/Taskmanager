import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Signup = () => {
    const { register } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 w-full max-w-md border border-gray-100">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-bold">
                        <UserPlus size={32} />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Create Account</h2>
                
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input 
                            type="text" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary focus:border-secondary transition outline-none"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary focus:border-secondary transition outline-none"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary focus:border-secondary transition outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-4 pt-2">
                        <label className="flex items-center text-sm text-gray-700">
                            <input type="radio" value="user" checked={role === 'user'} onChange={() => setRole('user')} className="mr-2 text-secondary focus:ring-secondary" />
                            User
                        </label>
                        <label className="flex items-center text-sm text-gray-700">
                            <input type="radio" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} className="mr-2 text-secondary focus:ring-secondary" />
                            Admin
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-secondary hover:bg-emerald-600 text-white font-bold py-3 px-4 mt-4 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition duration-300 transform hover:-translate-y-0.5">
                        Register
                    </button>
                </form>
                
                <p className="mt-8 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-secondary hover:text-emerald-600 font-bold">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
