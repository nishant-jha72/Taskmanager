const db = require('../db');

exports.createProject = async (req, res) => {
    const { name, deadline, userIds } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO projects (name, deadline, owner_id) VALUES (?, ?, ?)',
            [name, deadline || null, req.user.userId]
        );
        const projectId = result.insertId;

        if (userIds && Array.isArray(userIds) && userIds.length > 0) {
            const values = userIds.map(uid => [projectId, uid, req.user.userId]);
            await db.query(
                'INSERT INTO project_members (project_id, user_id, assigned_by) VALUES ?',
                [values]
            );
        }

        res.status(201).json({ id: projectId, name, deadline, owner_id: req.user.userId });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.assignProject = async (req, res) => {
    const { projectId } = req.params;
    const { userId } = req.body;
    try {
        await db.query(
            'INSERT INTO project_members (project_id, user_id, assigned_by) VALUES (?, ?, ?)',
            [projectId, userId, req.user.userId]
        );
        res.json({ message: 'User assigned to project successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const [projects] = await db.query('SELECT * FROM projects WHERE owner_id = ?', [req.user.userId]);
            res.json(projects);
        } else {
            const [projects] = await db.query(
                `SELECT p.* FROM projects p 
                 JOIN project_members pm ON p.id = pm.project_id 
                 WHERE pm.user_id = ?`,
                [req.user.userId]
            );
            res.json(projects);
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.deleteProject = async (req, res) => {
    const { projectId } = req.params;
    try {
        await db.query('DELETE FROM projects WHERE id = ?', [projectId]);
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getProjectActivity = async (req, res) => {
    const { projectId } = req.params;
    try {
        const [activity] = await db.query(`
            SELECT ts.*, u.name as user_name, t.title as task_title 
            FROM task_submissions ts 
            JOIN tasks t ON ts.task_id = t.id 
            JOIN users u ON ts.added_by = u.id 
            WHERE t.project_id = ? 
            ORDER BY ts.created_at DESC
        `, [projectId]);
        res.json(activity);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
