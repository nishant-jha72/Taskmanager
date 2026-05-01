const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { validateProject, validateProjectAssign } = require('../middleware/validationMiddleware');

router.get('/', verifyToken, projectController.getProjects);
router.post('/', verifyToken, isAdmin, validateProject, projectController.createProject);
router.post('/:projectId/assign', verifyToken, isAdmin, validateProjectAssign, projectController.assignProject);
router.delete('/:projectId', verifyToken, isAdmin, projectController.deleteProject);

router.get('/:projectId/activity', verifyToken, projectController.getProjectActivity);

module.exports = router;
