const db = require('../models');

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await db.Task.create({ title, description, status, userId: req.user.id });
    await db.ActivityLog.create({ userId: req.user.id, type: 'task:create', message: `Created task ${task.id}` });
    res.status(201).json(task);
  } catch (err) { next(err); }
};

exports.listTasks = async (req, res, next) => {
  try {
    const tasks = await db.Task.findAll({ where: { userId: req.user.id } });
    res.json(tasks);
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await db.Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) return res.status(404).json({ error: 'Not found' });
    const { title, description, status } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    await task.save();
    await db.ActivityLog.create({ userId: req.user.id, type: 'task:update', message: `Updated ${id}` });
    res.json(task);
  } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await db.Task.findOne({ where: { id, userId: req.user.id } });
    if (!task) return res.status(404).json({ error: 'Not found' });
    await task.destroy();
    await db.ActivityLog.create({ userId: req.user.id, type: 'task:delete', message: `Deleted ${id}` });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
