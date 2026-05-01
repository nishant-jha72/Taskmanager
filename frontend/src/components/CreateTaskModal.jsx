import React, { useState } from 'react';
import api from '../api';

const CreateTaskModal = ({ onClose, users, projects, refreshTasks, preSelectedProjectId }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        project_id: preSelectedProjectId || (projects.length > 0 ? projects[0].id : ''),
        priority: 'medium',
        due_date: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/tasks', formData);
            refreshTasks();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800">Create New Task</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold p-2 text-xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">{error}</div>}
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Task Title <span className="text-red-500">*</span></label>
                        <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" 
                            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Project <span className="text-red-500">*</span></label>
                            <select disabled={!!preSelectedProjectId} required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary bg-gray-50"
                                value={formData.project_id} onChange={e => setFormData({...formData, project_id: e.target.value})}>
                                <option value="" disabled>Select Project</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                            <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                                value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                            <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                                value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-5 py-2 font-semibold text-gray-600 hover:text-gray-800 transition">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition">Create Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
