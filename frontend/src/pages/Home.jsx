import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import CreateProjectModal from '../components/CreateProjectModal';
import ProjectActivityTable from '../components/ProjectActivityTable';

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // States
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ projects: 0, pending: 0, completed: 0 });
    
    // UI States
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [activeProjectId, setActiveProjectId] = useState(null); // Used to pass to CreateTaskModal
    const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'users'
    const [expandedActivityIds, setExpandedActivityIds] = useState([]);

    const toggleActivity = (projectId) => {
        setExpandedActivityIds(prev => 
            prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
        );
    };

    const fetchData = async () => {
        if (!user) return;
        try {
            // Fetch everything concurrently
            const [tasksRes, projRes, usersRes] = await Promise.all([
                api.get('/tasks').catch(() => ({ data: [] })),
                api.get('/projects').catch(() => ({ data: [] })),
                user.role === 'admin' ? api.get('/users').catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
            ]);

            setTasks(tasksRes.data);
            setProjects(projRes.data);
            setUsers(usersRes.data);

            const completed = tasksRes.data.filter(t => t.status === 'done').length;
            setStats({
                projects: projRes.data.length,
                pending: tasksRes.data.length - completed,
                completed: completed
            });
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm("Are you sure you want to delete this project? All associated tasks will be lost.")) {
            try {
                await api.delete(`/projects/${projectId}`);
                fetchData();
            } catch (err) {
                console.error("Failed to delete project", err);
                alert("Failed to delete project: " + (err.response?.data?.message || err.message));
            }
        }
    };

    useEffect(() => {
        if (!user) navigate('/');
        else fetchData();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="flex-1 flex justify-center bg-gray-50 min-h-screen">
            <div className="w-full max-w-7xl px-4 py-8">
                
                {/* Header Section */}
                <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800">Overview Dashboard</h1>
                        <p className="text-gray-500 mt-2">Manage your projects, tasks, and team tracking.</p>
                    </div>
                    {user.role === 'admin' && (
                        <div className="flex space-x-3">
                            <button 
                                onClick={() => setActiveTab('users')}
                                className={`px-5 py-2.5 rounded-xl font-bold transition ${activeTab === 'users' ? 'bg-gray-800 text-white shadow-lg' : 'bg-white border text-gray-700 hover:bg-gray-100'}`}
                            >
                                View User Data
                            </button>
                            <button 
                                onClick={() => setActiveTab('projects')}
                                className={`px-5 py-2.5 rounded-xl font-bold transition ${activeTab === 'projects' ? 'bg-primary text-white shadow-lg' : 'bg-white border text-gray-700 hover:bg-gray-100'}`}
                            >
                                Manage Projects
                            </button>
                            <button 
                                onClick={() => setIsProjectModalOpen(true)}
                                className="bg-gray-800 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold shadow-xl hover:shadow-gray-900/30 transition transform hover:-translate-y-0.5"
                            >
                                + Create Project
                            </button>
                        </div>
                    )}
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center">
                        <div className="text-gray-500 mb-1 font-semibold uppercase tracking-wider text-xs">Total Projects</div>
                        <div className="text-4xl font-extrabold text-gray-800">{stats.projects}</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center">
                        <div className="text-gray-500 mb-1 font-semibold uppercase tracking-wider text-xs">Tasks Pending</div>
                        <div className="text-4xl font-extrabold text-secondary">{stats.pending}</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center">
                        <div className="text-gray-500 mb-1 font-semibold uppercase tracking-wider text-xs">Tasks Completed</div>
                        <div className="text-4xl font-extrabold text-primary">{stats.completed}</div>
                    </div>
                </div>

                {/* Main Content Area */}
                {activeTab === 'projects' && (
                    <div className="space-y-8">
                        {projects.length === 0 ? (
                            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-16 border border-gray-100 text-center">
                                <span className="material-icons text-6xl mb-3 opacity-50 text-gray-400">folder_open</span>
                                <p className="text-lg font-medium text-gray-500">No projects created yet.</p>
                                {user.role === 'admin' && (
                                    <button onClick={() => setIsProjectModalOpen(true)} className="mt-4 bg-gray-800 text-white px-6 py-2 rounded-xl font-bold hover:bg-black">
                                        Create one now
                                    </button>
                                )}
                            </div>
                        ) : (
                            projects.map(proj => {
                                const projectTasks = tasks.filter(t => t.project_id === proj.id);
                                return (
                                    <div key={proj.id} className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-8 border border-gray-100">
                                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-2xl font-bold text-gray-800">{proj.name}</h3>
                                                    <button 
                                                        onClick={() => toggleActivity(proj.id)}
                                                        className="text-xs bg-indigo-50 hover:bg-indigo-100 text-primary px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 shadow-sm"
                                                    >
                                                        <span className="material-icons text-[14px]">history</span>
                                                        {expandedActivityIds.includes(proj.id) ? 'Hide Activity' : 'View Activity Feed'}
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">Deadline: {proj.deadline ? new Date(proj.deadline).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                            {user.role === 'admin' && (
                                                <div className="flex space-x-3">
                                                    <button 
                                                        onClick={() => handleDeleteProject(proj.id)}
                                                        className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-semibold shadow-sm transition"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setActiveProjectId(proj.id);
                                                            setIsTaskModalOpen(true);
                                                        }}
                                                        className="bg-primary hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-semibold shadow-md transition"
                                                    >
                                                        + Add Task
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {expandedActivityIds.includes(proj.id) && (
                                            <div className="mb-6 animate-fade-in-up">
                                                <ProjectActivityTable projectId={proj.id} />
                                            </div>
                                        )}
                                        
                                        {projectTasks.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400">
                                                <p className="text-sm font-medium">No tasks assigned to this project yet.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {projectTasks.map(task => (
                                                    <TaskCard 
                                                        key={task.id} 
                                                        task={task} 
                                                        userRole={user.role} 
                                                        refreshTasks={fetchData} 
                                                    />
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {activeTab === 'users' && user.role === 'admin' && (
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-8 border border-gray-100 overflow-hidden">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">User Database</h3>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase tracking-wider">
                                        <th className="p-4 border-b border-gray-200">ID</th>
                                        <th className="p-4 border-b border-gray-200">Name</th>
                                        <th className="p-4 border-b border-gray-200">Email</th>
                                        <th className="p-4 border-b border-gray-200">Role</th>
                                        <th className="p-4 border-b border-gray-200">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
                                            <td className="p-4 text-gray-500 font-medium">{u.id}</td>
                                            <td className="p-4 font-bold text-gray-800">{u.name}</td>
                                            <td className="p-4 text-gray-600">{u.email}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {u.status || 'Active'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>

            {/* Modals */}
            {isProjectModalOpen && (
                <CreateProjectModal 
                    onClose={() => setIsProjectModalOpen(false)} 
                    refreshData={fetchData} 
                    users={users}
                />
            )}
            {isTaskModalOpen && (
                <CreateTaskModal 
                    onClose={() => {
                        setIsTaskModalOpen(false);
                        setActiveProjectId(null);
                    }} 
                    users={users} 
                    projects={projects} 
                    refreshTasks={fetchData} 
                    preSelectedProjectId={activeProjectId}
                />
            )}
        </div>
    );
};

export default Home;
