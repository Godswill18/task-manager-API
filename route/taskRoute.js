const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTasks,
  deleteTasks,
  timeSpentOnTasks,
  getTasksReport
} = require('../controllers/tasksController.js');
const { protectRoute } = require('../middleware/protectRoute.js');

router.post('/tasks', protectRoute ,createTask);
router.get('/tasks', protectRoute, getTasks);
router.put('/tasks/:id', protectRoute, updateTasks);
router.delete('/tasks/:id', protectRoute, deleteTasks);
router.get('/report-time/:id', protectRoute,timeSpentOnTasks);
router.get('/report', protectRoute, getTasksReport);

module.exports = router;