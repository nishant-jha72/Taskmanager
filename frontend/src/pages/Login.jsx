import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 w-full max-w-md border border-gray-100">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                        <LogIn size={32} />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Welcome Back</h2>
                
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition outline-none"
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
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition duration-300 transform hover:-translate-y-0.5">
                        Sign In
                    </button>
                </form>
                
                <p className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/signup" className="text-primary hover:text-indigo-700 font-bold">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
