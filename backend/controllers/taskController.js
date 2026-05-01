const db = require('../db');

exports.createTask = async (req, res) => {
    const { project_id, title, description, priority, due_date } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO tasks (project_id, title, description, created_by, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)',
            [project_id, title, description, req.user.userId, priority || 'medium', due_date]
        );
        res.status(201).json({ id: result.insertId, message: 'Task created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const [tasks] = await db.query(`
                SELECT t.* FROM tasks t 
                JOIN projects p ON t.project_id = p.id 
                WHERE p.owner_id = ?
            `, [req.user.userId]);
            res.json(tasks);
        } else {
            const [tasks] = await db.query(`
                SELECT t.* FROM tasks t 
                JOIN project_members pm ON t.project_id = pm.project_id 
                WHERE pm.user_id = ?
            `, [req.user.userId]);
            res.json(tasks);
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateTaskProgress = async (req, res) => {
    const { taskId } = req.params;
    const { status, progress, update_description } = req.body;
    
    try {
        await db.query(
            'UPDATE tasks SET status = ?, progress = ? WHERE id = ?',
            [status, progress, taskId]
        );

        if (update_description) {
            await db.query(
                'INSERT INTO task_submissions (task_id, description, added_by, progress) VALUES (?, ?, ?, ?)',
                [taskId, update_description, req.user.userId, progress]
            );
        }

        res.json({ message: 'Task updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getTaskSubmissions = async (req, res) => {
    const { taskId } = req.params;
    try {
        const [history] = await db.query(`
            SELECT ts.*, u.name as user_name 
            FROM task_submissions ts 
            JOIN users u ON ts.added_by = u.id 
            WHERE ts.task_id = ? 
            ORDER BY ts.created_at DESC
        `, [taskId]);
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    const { taskId } = req.params;
    try {
        await db.query('DELETE FROM tasks WHERE id = ?', [taskId]);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
