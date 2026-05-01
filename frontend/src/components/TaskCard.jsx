import React, { useState } from 'react';
import api from '../api';

const TaskCard = ({ task, userRole, refreshTasks }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [progress, setProgress] = useState(task.progress);
    const [status, setStatus] = useState(task.status);
    const [updateDescription, setUpdateDescription] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await api.patch(`/tasks/${task.id}`, { 
                status, 
                progress, 
                update_description: updateDescription 
            });
            setIsEditing(false);
            setUpdateDescription('');
            refreshTasks();
        } catch (err) {
            console.error('Failed to update task', err);
            alert('Failed to update task: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this task? This cannot be undone.")) {
            try {
                await api.delete(`/tasks/${task.id}`);
                refreshTasks();
            } catch (err) {
                console.error("Failed to delete task", err);
                alert("Failed to delete task");
            }
        }
    };

    const loadHistory = async () => {
        if (!showHistory) {
            try {
                const res = await api.get(`/tasks/${task.id}/history`);
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch history");
            }
        }
        setShowHistory(!showHistory);
    };

    const statusColors = {
        todo: 'bg-gray-100 text-gray-700',
        in_progress: 'bg-blue-100 text-blue-700',
        review: 'bg-yellow-100 text-yellow-700',
        done: 'bg-green-100 text-green-700'
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-primary hover:shadow-lg transition duration-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-gray-800 text-lg">{task.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ')}
                </span>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1 font-semibold">
                    <span>Overall Progress</span>
                    <span>{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${task.progress}%` }}></div>
                </div>
            </div>

            {isEditing ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Update Progress (0-100)</label>
                        <input 
                            type="number" 
                            min="0" max="100" 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                            value={progress}
                            onChange={(e) => setProgress(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                        <select 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Update Details (Optional Record)</label>
                        <textarea 
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                            placeholder="What did you work on?"
                            value={updateDescription}
                            onChange={(e) => setUpdateDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="flex space-x-2 pt-2">
                        <button onClick={handleUpdate} disabled={loading} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-bold shadow hover:bg-indigo-700 transition">Save Update</button>
                        <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-bold hover:bg-gray-300 transition">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                    <div className="flex flex-col space-y-2">
                        <button onClick={loadHistory} className="text-gray-500 hover:text-gray-800 text-xs font-medium underline text-left">
                            {showHistory ? 'Hide Records' : 'View Records'}
                        </button>
                        {userRole === 'admin' && (
                            <button onClick={handleDelete} className="text-red-500 hover:text-red-700 text-xs font-bold w-fit transition">
                                Delete Task
                            </button>
                        )}
                    </div>
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="text-primary hover:text-indigo-800 text-sm font-bold bg-indigo-50 px-3 py-1 rounded-lg"
                    >
                        Add Status
                    </button>
                </div>
            )}

            {showHistory && (
                <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100 max-h-40 overflow-y-auto">
                    <h5 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Historical Updates</h5>
                    {history.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No updates recorded yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {history.map(record => (
                                <li key={record.id} className="text-sm bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1 border-b border-gray-50 pb-1">
                                        <span className="font-bold text-primary">{record.progress}% Reached</span>
                                        <span className="font-semibold text-gray-600">{record.user_name} • {new Date(record.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm mt-1">{record.description || <span className="italic text-gray-400">No details provided</span>}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskCard;
