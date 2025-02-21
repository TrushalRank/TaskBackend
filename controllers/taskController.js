const Task = require("../models/Task");

// ✅ Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required." });
    if (!userId) return res.status(400).json({ message: "User ID is required." });

    const newTask = new Task({ title, userId, description });
    await newTask.save();

    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating task.", error });
  }
};

// ✅ Get all tasks for logged-in user
exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    
    if (!userId) return res.status(400).json({ message: "User ID is required." });

    const tasks = await Task.find({ userId });
    res.json({ message: "Tasks fetched successfully.", tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks.", error });
  }
};

// ✅ Get a specific task
exports.getTaskById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id: taskId } = req.params;

    if (!taskId) return res.status(400).json({ message: "Task ID is required." });
    if (!userId) return res.status(400).json({ message: "User ID is required." });

    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) return res.status(404).json({ message: "Information not found." });

    res.json({ message: "Task fetched successfully.", task });
  } catch (error) {
    res.status(500).json({ message: "Error fetching task.", error });
  }
};

// ✅ Update a task
exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, completed } = req.body;
    const { id: taskId } = req.params;

    if (!taskId) return res.status(400).json({ message: "Task ID is required." });
    if (!userId) return res.status(400).json({ message: "User ID is required." });

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { title, description, completed },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ message: "Information not found." });

    res.json({ message: "Task updated successfully.", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task.", error });
  }
};

// ✅ Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id: taskId } = req.params;

    if (!taskId) return res.status(400).json({ message: "Task ID is required." });
    if (!userId) return res.status(400).json({ message: "User ID is required." });

    const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!deletedTask) return res.status(404).json({ message: "Information not found." });

    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task.", error });
  }
};
