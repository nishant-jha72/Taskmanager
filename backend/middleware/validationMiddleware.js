const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    next();
};

const validateRegister = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 255 }).withMessage('Name must be less than 255 characters'),
    body('email').isEmail().withMessage('Must be a valid email address').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Role must be either admin or user'),
    handleValidationErrors
];

const validateLogin = [
    body('email').isEmail().withMessage('Must be a valid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

const validateProject = [
    body('name').trim().notEmpty().withMessage('Project name is required').isLength({ max: 255 }).withMessage('Project name too long'),
    body('deadline').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Invalid deadline date format'),
    body('userIds').optional({ nullable: true }).isArray().withMessage('userIds must be an array'),
    handleValidationErrors
];

const validateProjectAssign = [
    body('userId').isInt().withMessage('User ID must be an integer'),
    handleValidationErrors
];

const validateTask = [
    body('project_id').isInt().withMessage('Project ID is required and must be an integer'),
    body('title').trim().notEmpty().withMessage('Task title is required').isLength({ max: 255 }).withMessage('Task title too long'),
    body('description').optional().isString().withMessage('Description must be text'),
    body('assigned_to').optional({ nullable: true, checkFalsy: true }).isInt().withMessage('Assigned To must be a user ID'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
    body('due_date').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Invalid due date format'),
    handleValidationErrors
];

const validateTaskUpdate = [
    body('status').optional().isIn(['todo', 'in_progress', 'review', 'done']).withMessage('Invalid task status'),
    body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be an integer between 0 and 100'),
    body('update_description').optional().isString().withMessage('Description must be text'),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateProject,
    validateProjectAssign,
    validateTask,
    validateTaskUpdate
};
