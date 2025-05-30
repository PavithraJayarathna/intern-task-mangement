const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router
  .route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router
  .route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;