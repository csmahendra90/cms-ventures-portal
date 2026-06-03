const express = require('express');
const router = express.Router();
const { teamMembers, tasks } = require('../data/store');

// GET all team members
router.get('/members', (req, res) => {
  res.json({ success: true, data: teamMembers });
});

// GET all tasks (with optional filters)
router.get('/tasks', (req, res) => {
  let result = [...tasks];
  const { assignee, deal, priority, done } = req.query;
  if (assignee) result = result.filter(t => t.assignee === assignee);
  if (deal)     result = result.filter(t => t.deal === deal);
  if (priority) result = result.filter(t => t.priority === priority);
  if (done !== undefined) result = result.filter(t => t.done === (done === 'true'));
  res.json({ success: true, count: result.length, data: result });
});

// POST new task
router.post('/tasks', (req, res) => {
  const { title, assignee, deal, prio, due, type } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'title required' });
  const newTask = {
    id: tasks.length + 1,
    title,
    assignee: assignee || 'Priya S.',
    deal: deal || 'General',
    prio: prio || 'Medium',
    due: due || '2026-04-30',
    done: false,
    type: type || 'General',
  };
  tasks.push(newTask);
  res.status(201).json({ success: true, data: newTask });
});

// PATCH toggle task done
router.patch('/tasks/:id/toggle', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  task.done = !task.done;
  res.json({ success: true, data: task });
});

// DELETE task
router.delete('/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Task not found' });
  tasks.splice(idx, 1);
  res.json({ success: true, message: 'Task deleted' });
});

module.exports = router;
