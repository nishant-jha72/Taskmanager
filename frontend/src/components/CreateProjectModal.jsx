import React, { useState } from 'react';
import api from '../api';

const CreateProjectModal = ({ onClose, refreshData, users }) => {
    const [formData, setFormData] = useState({ name: '', deadline: '', userIds: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheckboxToggle = (userId) => {
        setFormData((prev) => {
            const exists = prev.userIds.includes(userId);
            if (exists) {
                return { ...prev, userIds: prev.userIds.filter(id => id !== userId) };
            } else {
                return { ...prev, userIds: [...prev.userIds, userId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/projects', formData);
            refreshData();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                    <h3 className="text-xl font-bold text-gray-800">Create New Project</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold p-2 text-xl transition">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">{error}</div>}
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Project Name <span className="text-red-500">*</span></label>
                        <input required type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition" 
                            placeholder="Website Redesign"
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Target Deadline</label>
                        <input type="date" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                            value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Initial Users</label>
                        <div className="border border-gray-200 rounded-xl max-h-40 overflow-y-auto bg-gray-50 p-2 space-y-1">
                            {users && users.length > 0 ? users.map((u) => (
                                <label key={u.id} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition">
                                    <input 
                                        type="checkbox" 
                                        className="form-checkbox h-4 w-4 text-primary rounded focus:ring-primary border-gray-300"
                                        checked={formData.userIds.includes(u.id)}
                                        onChange={() => handleCheckboxToggle(u.id)}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800">{u.name}</span>
                                        <span className="text-xs text-gray-500">{u.email}</span>
                                    </div>
                                </label>
                            )) : (
                                <p className="text-sm text-gray-500 p-2">No users available for assignment.</p>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Selected: {formData.userIds.length} users</p>
                    </div>

                    <div className="pt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gray-800 text-white rounded-xl font-bold shadow-lg hover:bg-black transition">Create Project</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
