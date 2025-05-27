const TaskModel = require('../models/taskModel.js');
const UserModel = require('../models/userModel.js'); 
const sequelize = require('sequelize');

const { User, Task } = require('../models/index.js');


const createTask = async(req, res) => {
    try{
        const Tasks = await TaskModel(); // Tasks model instance
        const User = await UserModel(); // user model instance

        // check if authenticated user isAdmin
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Forbidden: Only admins can create tasks' });
        }
        
         const { title, description, dueDate, status, userId } = req.body;
    
        // Validate request body
        if (!title || !description) {
            return res.status(400).json({ success: false, message: 'Title and description are required' });
        }
        if (dueDate && isNaN(new Date(req.body.dueDate).getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid due date' });
        }


        // check if assigned user exists
        const assignedUser = await User.findByPk(userId);
        if (!assignedUser) {
        return res.status(404).json({ success: false, message: 'User to assign task not found' });
        }
        

        // Create a new task
        const newTask = await Tasks.create({
            title,
            description,
            status: status || 'pending', 
            dueDate: dueDate || new Date(),// Default to current date if not provided
            userId // Assign the task to the user
        });

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: {
                id: newTask.id,
                title: newTask.title,
                description: newTask.description,
                status: newTask.status,
                dueDate: newTask.dueDate,
                userId: newTask.userId
            }
        });

    }catch(error) {
        console.log(error);
        console.error("Error in createTask:", error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const getTasks = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;        // default to page 1
    const limit = parseInt(req.query.limit) || 10;     // default 10 tasks per page
    const offset = (page - 1) * limit;

    // Filtering by status (optional)
    const statusFilter = req.query.status; // e.g., /tasks?status=pending

    const whereCondition = {};
    if (statusFilter) {
      whereCondition.status = statusFilter;
    }

    // Query tasks with pagination + filtering
    const { rows: tasks, count: totalTasks } = await Task.findAndCountAll({
      where: whereCondition,
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      meta: {
        total: totalTasks,
        page,
        totalPages: Math.ceil(totalTasks / limit),
        limit
      },
      data: tasks
    });

  } catch (error) {
    console.error("Error in getTasks:", error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const updateTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    // Ensure at least one field is present
    if (!title && !description && !status && !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'At least one field is required to update'
      });
    }

    // Find the task by ID
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // 🔐 Explicit admin check: only update all fields if user isAdmin === true
    if (req.user && req.user.isAdmin === true) {
      // Admin can update everything
      await task.update({
        title: title || task.title,
        description: description || task.description,
        status: status || task.status,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate
      });

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully (admin)',
        data: task
      });
    } else {
      // Non-admins can only update status
      if (!status) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Only task status can be updated by non-admin users'
        });
      }

      await task.update({
        status
      });

      return res.status(200).json({
        success: true,
        message: 'Task status updated successfully (non-admin)',
        data: task
      });
    }

  } catch (error) {
    console.error("Error in updateTasks:", error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};



const deleteTasks = async(req, res) => {
    try{
        const { id } = req.params; // Task ID from the request parameters

            // Check if user is an admin
        if (!req.user || req.user.isAdmin !== true) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Only admins can delete tasks'
        });
        }

        // Find the task by ID
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Delete the task
        await task.destroy();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });

    }catch(error) {
        console.error("Error in deleteTasks:", error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const timeSpentOnTasks = async (req, res) => {
  try {
    const { id } = req.params;

    // Find task by ID
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Calculate time difference (in milliseconds)
    const createdAt = new Date(task.createdAt);
    const updatedAt = new Date(task.updatedAt);
    const timeDiffMs = updatedAt - createdAt;

    // Convert to minutes
    const timeSpentMinutes = Math.floor(timeDiffMs / (1000 * 60));

    res.status(200).json({
      success: true,
      message: 'Time spent on task retrieved successfully',
      data: {
        taskId: task.id,
        title: task.title,
        timeSpentInMinutes: timeSpentMinutes,
        createdAt,
        updatedAt
      }
    });

  } catch (error) {
    console.error("Error in timeSpentOnTasks:", error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const getTasksReport = async(req, res) => { 
    try{
        const tasks = await Task.findAll({
            attributes: [
                'id',
                'title',
                'description',
                'status',
                'dueDate',
                [sequelize.fn('SUM', sequelize.col('timeSpent')), 'totalTimeSpent']
            ],
            group: ['Tasks.id', 'User.id'],
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            message: 'Tasks report retrieved successfully',
            data: tasks
        });

    }catch(error) {
        // console.log(error);
        console.error("Error in getTasksReport:", error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


module.exports = { createTask, getTasks, updateTasks, deleteTasks, timeSpentOnTasks, getTasksReport };