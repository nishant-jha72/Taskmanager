import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useContext(AuthContext);

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex-1 bg-white min-h-[calc(100vh-64px)] flex flex-col pt-20">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
                    Manage projects. <br className="hidden md:block" />
                    <span className="text-primary">Deliver faster.</span>
                </h1>
                
                <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto mb-10">
                    TaskFlow is the ultimate Role-Based project management system. Assign teams, track live progress, and manage entire workflows with strict permissions and granular history logging.
                </p>
                
                <div className="flex justify-center space-x-4">
                    <Link to="/signup" className="bg-primary hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-500/30 transition transform hover:-translate-y-1">
                        Get Started Free
                    </Link>
                    <Link to="/login" className="bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 px-8 py-4 rounded-2xl text-lg font-bold transition">
                        Sign into Dashboard
                    </Link>
                </div>
            </div>

            {/* Feature Highlights */}
            <div className="mt-24 bg-gray-50 flex-1 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <span className="material-icons text-primary text-4xl mb-4 bg-indigo-50 p-4 rounded-2xl">security</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Role-Based Access</h3>
                            <p className="text-gray-500">Strictly segregate functionalities between Admins and standard Users securely over JWT.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <span className="material-icons text-primary text-4xl mb-4 bg-indigo-50 p-4 rounded-2xl">account_tree</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Project Oriented</h3>
                            <p className="text-gray-500">Group hundreds of tasks neatly underneath top-level structural project umbrellas automatically.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <span className="material-icons text-primary text-4xl mb-4 bg-indigo-50 p-4 rounded-2xl">history</span>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Granular Tracking</h3>
                            <p className="text-gray-500">Review full timeline aggregation showcasing exactly who changed what, when they changed it.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="bg-white py-8 text-center text-gray-400 text-sm font-medium border-t border-gray-100">
                &copy; 2026 EtharaAI Task Manager Systems. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
