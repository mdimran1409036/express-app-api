import ErrorHandler from "../middleware/error.js";
import { Task } from "../Model/task.js";

const getMyTasks = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const tasks = await Task.find({ user: userId });
        res.status(200).json({
            success: true,
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
    const { title, description } = req.body;
    const user = req.user;
    const document = {
        title,
        description,
        user,
    };
    try {
        const response = await Task.create(document);
        res.status(201).json({
            success: true,
            message: "task added successfully",
        });
    } catch (error) {
        next(error);
    }
};
const updateTask = async (req, res, next) => {
    const { taskId } = req.params;
    const query = { _id: taskId };
    try {
        const task = await Task.findById(query);
        if (!task) return next(new ErrorHandler("Task not found", 404));

        task.isCompleted = !task.isCompleted;
        await task.save();
        res.status(200).json({
            success: true,
            message: "task is updated successfully",
        });
    } catch (error) {
        next(error);
    }
};
const deleteTask = async (req, res, next) => {
    const { taskId } = req.params;
    const query = { _id: taskId };
    try {
        const task = await Task.findById(query);
        if (!task) return next(new ErrorHandler("Task not found", 404));
        await task.deleteOne();
        res.status(200).json({
            success: true,
            message: "task is deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export { getMyTasks, createTask, updateTask, deleteTask };
