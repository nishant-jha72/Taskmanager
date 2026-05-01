import React, { useState, useEffect } from 'react';
import api from '../api';

const ProjectActivityTable = ({ projectId }) => {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await api.get(`/projects/${projectId}/activity`);
                setActivity(res.data);
            } catch (err) {
                setError('Failed to load activity');
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, [projectId]);

    if (loading) return <div className="p-4 text-center text-sm text-gray-500">Loading activity feed...</div>;
    if (error) return <div className="p-4 text-center text-sm text-red-500">{error}</div>;

    if (activity.length === 0) {
        return (
            <div className="p-6 text-center bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">No activity recorded for this project yet.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider">
                        <th className="p-4 border-b border-gray-100">Date Logged</th>
                        <th className="p-4 border-b border-gray-100">User</th>
                        <th className="p-4 border-b border-gray-100">Task Name</th>
                        <th className="p-4 border-b border-gray-100">Progress</th>
                        <th className="p-4 border-b border-gray-100">Details / Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {activity.map(record => (
                        <tr key={record.id} className="hover:bg-gray-50 transition">
                            <td className="p-4 text-xs font-medium text-gray-500">
                                {new Date(record.created_at).toLocaleString()}
                            </td>
                            <td className="p-4 text-sm font-bold text-indigo-900 border-l border-gray-50">
                                {record.user_name}
                            </td>
                            <td className="p-4 text-sm font-semibold text-gray-700 min-w-[150px]">
                                {record.task_title}
                            </td>
                            <td className="p-4 text-sm font-bold text-primary">
                                {record.progress}%
                            </td>
                            <td className="p-4 text-sm text-gray-600 italic">
                                {record.description || 'No description provided.'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectActivityTable;
