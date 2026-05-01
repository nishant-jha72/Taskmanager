const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { validateTask, validateTaskUpdate } = require('../middleware/validationMiddleware');

router.get('/', verifyToken, taskController.getTasks);
router.post('/', verifyToken, isAdmin, validateTask, taskController.createTask);
router.patch('/:taskId', verifyToken, validateTaskUpdate, taskController.updateTaskProgress);
router.get('/:taskId/history', verifyToken, taskController.getTaskSubmissions);
router.delete('/:taskId', verifyToken, isAdmin, taskController.deleteTask);

module.exports = router;
