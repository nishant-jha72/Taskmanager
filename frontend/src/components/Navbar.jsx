import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to={user ? "/dashboard" : "/"} className="text-2xl font-extrabold text-primary tracking-tight flex items-center gap-2">
                            <span className="material-icons bg-primary text-white p-1 rounded-lg">task_alt</span>
                            TaskFlow
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        {user ? (
                            <>
                                <div className="text-right hidden md:block">
                                    <div className="text-sm font-bold text-gray-800">{user.name}</div>
                                    <div className="text-xs font-semibold text-primary uppercase tracking-widest">{user.role}</div>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2"
                                >
                                    Log Out
                                    <span className="material-icons text-[16px]">logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex space-x-3">
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-bold px-4 py-2 text-sm transition">Log in</Link>
                                <Link to="/signup" className="bg-primary hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-0.5">Sign up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
