const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/taskController');

router.use(auth);

router.post('/', [body('title').isString().notEmpty()], validate, ctrl.createTask);
router.get('/', ctrl.listTasks);
router.put('/:id', [param('id').isUUID(), body('title').optional().isString()], validate, ctrl.updateTask);
router.delete('/:id', [param('id').isUUID()], validate, ctrl.deleteTask);

module.exports = router;
